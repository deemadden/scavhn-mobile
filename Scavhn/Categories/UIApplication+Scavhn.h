//
//
// Copyright (c) 2013 SoftSource. All rights reserved.
//


#import <Foundation/Foundation.h>

@class ScavhnViewController;
@class ScavhnAppDelegate;

@interface UIApplication (Scavhn)

- (ScavhnAppDelegate *)appDelegate;
- (ScavhnViewController*)scavhnViewController;

@end