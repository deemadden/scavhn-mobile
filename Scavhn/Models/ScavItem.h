//
//  ScavItem.h
//  Scavhn
//
//  Created by Dee Madden on 1/31/14.
//  Copyright (c) 2014 SoftSource. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreData/CoreData.h>

@class Scav;

@interface ScavItem : NSManagedObject

@property (nonatomic, retain) NSMutableDictionary * coordinates;
@property (nonatomic, retain) NSString * hint;
@property (nonatomic, retain) NSString * name;
@property (nonatomic, retain) NSString * pointColor;
@property (nonatomic, retain) NSNumber * pointValue;
@property (nonatomic, retain) NSString * scavItemId;
@property (nonatomic, retain) NSString * status;
@property (nonatomic, retain) NSString * thumbnail;
@property (nonatomic, retain) NSString * thumbnailType;
@property (nonatomic, retain) Scav *scavParent;

@end
