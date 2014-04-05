//
//
// Copyright (c) 2013 SoftSource. All rights reserved.
//


#import <Foundation/Foundation.h>


@interface WebServicesManager : NSObject

+ (NSURLSessionTask *)retrieveAllScavsDataWithCompletionBlock:(void (^)(id json, NSError *error))completionBlock;

+ (NSURLSessionTask *)updateScavItemWithInfo:(NSDictionary *)scavItemUpdateInfo withCompletionBlock:(void (^)(id, NSError *))completionBlock;
@end