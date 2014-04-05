//
// Created by Dee Madden on 11/4/13.
// Copyright (c) 2013 SoftSource. All rights reserved.
//


#import <Foundation/Foundation.h>

@class MockScav;

@interface MockScavsDownload : NSObject

@property (nonatomic, retain) NSDate * downloadDate;
@property (nonatomic, retain) NSSet *scavs;

- (void)addScavsObject:(MockScav *)value;
- (void)removeScavsObject:(MockScav *)value;
- (void)addScavs:(NSSet *)values;
- (void)removeScavs:(NSSet *)values;

@end