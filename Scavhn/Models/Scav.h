//
//  Scav.h
//  Scavhn
//
//  Created by Dee Madden on 1/30/14.
//  Copyright (c) 2014 SoftSource. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreData/CoreData.h>

@class ScavItem, ScavsDownload;

@interface Scav : NSManagedObject

@property (nonatomic, retain) NSString * image;
@property (nonatomic, retain) NSString * imageType;
@property (nonatomic, retain) NSString * level;
@property (nonatomic, retain) NSString * name;
@property (nonatomic, retain) NSString * scavDescription;
@property (nonatomic, retain) NSString * scavId;
@property (nonatomic, retain) NSString * duration;
@property (nonatomic, retain) NSString * thumbnail;
@property (nonatomic, retain) NSString * thumbnailType;
@property (nonatomic, retain) NSString * scavMongoId;
@property (nonatomic, retain) NSString * status;
@property (nonatomic, retain) NSSet *scavItems;
@property (nonatomic, retain) ScavsDownload *scavsDownloadParent;
@end

@interface Scav (CoreDataGeneratedAccessors)

- (void)addScavItemsObject:(ScavItem *)value;
- (void)removeScavItemsObject:(ScavItem *)value;
- (void)addScavItems:(NSSet *)values;
- (void)removeScavItems:(NSSet *)values;

@end
