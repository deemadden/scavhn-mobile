//
// Created by Dee Madden on 1/30/14.
// Copyright (c) 2014 SoftSource. All rights reserved.
//

#import <CoreData/CoreData.h>
#import "SaveScavGameBeginRequestOperation.h"
#import "CoreDataContextSingleton.h"
#import "JSONHelper.h"
#import "ScavsDataStore.h"


@implementation
SaveScavGameBeginRequestOperation

- (void)start {
  if (![self startingExecution])
    return;

  NSError* error = nil;

  // Create a context to connect to Core Data
  NSManagedObjectContext* context = [[NSManagedObjectContext alloc] init];
  context.persistentStoreCoordinator = [[CoreDataContextSingleton sharedInstance] persistentStoreCoordinator];

  // Figure out which Scav the Player Picked
  NSString* decodedUrl = [self.request.URL.path stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
  NSRegularExpression* regex = [NSRegularExpression regularExpressionWithPattern:@".*users/([a-zA-Z-_]+)/scavs/([a-zA-Z-_]+)" options:NSRegularExpressionCaseInsensitive error:&error];

  NSString* playerName = [regex stringByReplacingMatchesInString:decodedUrl options:0 range:NSMakeRange(0, [decodedUrl length]) withTemplate:@"$1"];
  NSString* scavName = [regex stringByReplacingMatchesInString:decodedUrl options:0 range:NSMakeRange(0, [decodedUrl length]) withTemplate:@"$2"];

  // Get the changes from the HTTP request body
  NSString* requestBodyJSONString = [[NSString alloc] initWithBytes:self.request.HTTPBody.bytes length:self.request.HTTPBody.length encoding:NSUTF8StringEncoding];
  NSDictionary* requestBodyJSONDict = [JSONHelper decodeJSON:requestBodyJSONString];

  NSString* originalScavId = requestBodyJSONDict[@"originalScavId"];
  NSString* userScavStartTime = requestBodyJSONDict[@"userScavStartTime"];

  // Save Scav hunt begin info to Core Data.
  // We're disconnected down in the native container.  As a result, we aren't going to have a real MongoDB id for the Scav.
  // So we're going to have to generate a placeholder to support the ability for the JS to do its thing
  [ScavsDataStore saveBeginScavDataForPlayer:playerName
                        withSelectedScavName:scavName
                  withSelectedScavOriginalId:originalScavId
                               withStartTime:userScavStartTime
                                 withContext:context
                                   withError:&error];

  RELEASE_SAFELY(context);

  if(error == nil)
    [self finishedWithSuccessStatusAndJSONResponseObject:@{@"name" : @"vulture" }];
  else
    [self finishedExecutionWithStatus:500 andJSONResponseObject:@{@"SaveScavGameBeginRequestOperation" : @"An error occurred applying Scav begin updates." }];
}

@end