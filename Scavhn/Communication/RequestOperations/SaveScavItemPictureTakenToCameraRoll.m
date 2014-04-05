//
// Created by Dee Madden on 1/2/14.
// Copyright (c) 2014 SoftSource. All rights reserved.
//

#import "SaveScavItemPictureTakenToCameraRoll.h"
#import "JSONHelper.h"


@interface SaveScavItemPictureTakenToCameraRoll()

@property(nonatomic, strong) NSString* scavItemId;

@end

@implementation SaveScavItemPictureTakenToCameraRoll

- (void)start
{
  if (![self startingExecution])
   	return;

  NSError *error = nil;

  NSRegularExpression* regex = [NSRegularExpression regularExpressionWithPattern:@".*users/([a-zA-Z-_]+)/scavs/([a-zA-Z-_]+)/items/tocameraroll" options:NSRegularExpressionCaseInsensitive error:&error];
  NSString* userName = [regex stringByReplacingMatchesInString:self.request.URL.absoluteString options:0 range:NSMakeRange(0, [self.request.URL.absoluteString length]) withTemplate:@"$1"];
  NSString* scavName = [regex stringByReplacingMatchesInString:self.request.URL.absoluteString options:0 range:NSMakeRange(0, [self.request.URL.absoluteString length]) withTemplate:@"$2"];

  // Convert the request body to a dictionary
  NSString* requestBodyJSONString = [[NSString alloc] initWithBytes:self.request.HTTPBody.bytes length:self.request.HTTPBody.length encoding:NSUTF8StringEncoding];
  NSDictionary* imgUrlDict = [JSONHelper decodeJSON:requestBodyJSONString];

  Log4ObjC(@"Saving Pic taken or chosen for scavItemId: %@ username: %@ playing Scav: %@", imgUrlDict[@"scavItemId"], userName, scavName);

  // Now save the picture if there is one to save, otherwise throw a 500
  if(imgUrlDict[@"imgUrl"] != nil)
  {
    self.scavItemId = imgUrlDict[@"scavItemId"];

    NSData* imageData = [[NSData alloc] initWithBase64EncodedString:imgUrlDict[@"imgUrl"]
                                                            options:NSDataBase64DecodingIgnoreUnknownCharacters];

    UIImage* image = [UIImage imageWithData:imageData];

    UIImageWriteToSavedPhotosAlbum(image, self, @selector(savedImageToCameraRoll:withError:andContextInfo:), nil);
  }
  else
    [self finishedExecutionWithStatus:500 andJSONResponseObject:@{@"pictureFileName": @"Error: No image available in JSON request body."}];
}

#pragma mark Post-Image save selector method
- (void)savedImageToCameraRoll:(UIImage *)image withError:(NSError *)error andContextInfo:(void *)contextInfo 
{
  if(error)
    [self finishedExecutionWithStatus:500 andJSONResponseObject:@{ @"pictureFileName": @"Error occurred saving picture" }];
  else
    // TODO: Find a way to create a web-optimized version of the image that the camera view can look up and set as src next time the user navigates in on this item
    [self finishedExecutionWithStatus:200 andJSONResponseObject:@{ @"pictureForScavItem": [NSString stringWithFormat:@"%@", self.scavItemId] }];
}

@end