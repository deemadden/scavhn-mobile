//
//
// Copyright (c) 2013 SoftSource. All rights reserved.
//


#import <Foundation/Foundation.h>


@interface ScavsDataStore : NSObject
+ (void)saveAllScavsJsonToCoreData:(id)json withError:(NSError **)pError;

+ (void)saveBeginScavDataForPlayer:(NSString *)playerName withSelectedScavName:(NSString *)scavName withSelectedScavOriginalId:(NSString *)scavId withStartTime:(NSString *)startTime withContext:(NSManagedObjectContext *)context withError:(NSError **)error;
@end