//
//  ScavsDownload.h
//  Scavhn
//
//
//  Copyright (c) 2013 SoftSource. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreData/CoreData.h>

@class Scav;

@interface ScavsDownload : NSManagedObject

@property (nonatomic, retain) NSDate * downloadDate;
@property (nonatomic, retain) NSSet *scavs;
@end

@interface ScavsDownload (CoreDataGeneratedAccessors)

- (void)addScavsObject:(Scav *)value;
- (void)removeScavsObject:(Scav *)value;
- (void)addScavs:(NSSet *)values;
- (void)removeScavs:(NSSet *)values;

@end
