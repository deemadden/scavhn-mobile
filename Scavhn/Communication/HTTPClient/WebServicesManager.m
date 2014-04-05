//
//
// Copyright (c) 2013 SoftSource. All rights reserved.
//


#import "WebServicesManager.h"
#import "AFNHTTPClientSingleton.h"
#import "ScavsDataStore.h"
#import "JSONHelper.h"


@implementation WebServicesManager

+ (NSURLSessionTask *)retrieveAllScavsDataWithCompletionBlock:(void (^)(id json, NSError *error))completionBlock
{
  return [[AFNHTTPClientSingleton sharedClient] GET:@"scavs"
                                         parameters:@{@"withItems" : @"y"}
                                            success:^(NSURLSessionDataTask* __unused task, id JSON)
                                            {
                                              completionBlock(JSON, nil);
                                            }
                                            failure:^(NSURLSessionDataTask* __unused task, NSError* error)
                                            {
                                              Log4ObjC(@"An error occurred making the request.  %@ error:%@", task.originalRequest, error);
                                              completionBlock(nil, error);
                                            }];
}

+ (NSURLSessionTask *)updateScavItemWithInfo:(NSDictionary *)scavItemUpdateInfo withCompletionBlock:(void (^)(id, NSError *))completionBlock
{
  // Get a handle on the web client
  AFNHTTPClientSingleton* afnWebClient = [AFNHTTPClientSingleton sharedClient];

  NSString* baseUrl = [afnWebClient.baseURL absoluteString];
  NSString* path = [NSString stringWithFormat:@"%@users/%@/scavs/%@/items/%@",
                                                  baseUrl,
                                                  scavItemUpdateInfo[@"playerName"],
                                                  scavItemUpdateInfo[@"scavId"],
                                                  scavItemUpdateInfo[@"scavItemId"]];
  // Build a request body
  NSDictionary* requestBody = @{
      @"scavItemName" : scavItemUpdateInfo[@"scavItemName"],
      @"heading" : scavItemUpdateInfo[@"heading"],
      @"coordinates" : scavItemUpdateInfo[@"coordinates"],
      @"altitude" : scavItemUpdateInfo[@"altitude"],
      @"altitudeAccuracy" : scavItemUpdateInfo[@"altitudeAccuracy"],
      @"accuracy" : scavItemUpdateInfo[@"accuracy"]
  };

  // Build a PUT request
  NSMutableURLRequest* mutableURLRequest = [afnWebClient.requestSerializer requestWithMethod:@"PUT" URLString:[[NSURL URLWithString:path] absoluteString] parameters:nil];

  // Set the request body on it
  NSString* jsonRequestBody = [JSONHelper encodeJSON:requestBody asCompactAndSerialized:YES];

  [mutableURLRequest setHTTPBody:[jsonRequestBody dataUsingEncoding:NSUTF8StringEncoding]];
  // adjust http header info
  [mutableURLRequest setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
  [mutableURLRequest setValue:@"application/json" forHTTPHeaderField:@"Accept"];
  [mutableURLRequest setValue:@"no-cache" forHTTPHeaderField:@"Cache-Control"];

  // Now make the call, using the __block hint to let the compiler know we're going to hang out on this thread until the callback
  __block NSURLSessionDataTask* task = [afnWebClient dataTaskWithRequest:mutableURLRequest
                                                       completionHandler:^(NSURLResponse *__unused response, id JSON, NSError *error)
                                                                          {
                                                                            if (error) {
                                                                              completionBlock(nil, error);
                                                                            }
                                                                            else {
                                                                              completionBlock(JSON, nil);
                                                                            }
                                                                          }];
  // Now continue on, and return the task back out
  [task resume];

  return task;
}

@end