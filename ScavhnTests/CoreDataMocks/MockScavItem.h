//
// Created by Dee Madden on 11/4/13.
// Copyright (c) 2013 SoftSource. All rights reserved.
//


#import <Foundation/Foundation.h>

@class MockScav;

@interface MockScavItem : NSObject

@property (nonatomic, retain) NSMutableDictionary * coordinates;
@property (nonatomic, retain) NSString * hint;
@property (nonatomic, retain) NSString * name;
@property (nonatomic, retain) NSString * pointColor;
@property (nonatomic, retain) NSNumber * pointValue;
@property (nonatomic, retain) NSString * scavItemId;
@property (nonatomic, retain) NSString * status;
@property (nonatomic, retain) NSString * thumbnail;
@property (nonatomic, retain) NSString * thumbnailType;
@property (nonatomic, retain) MockScav *scavParent;

@end