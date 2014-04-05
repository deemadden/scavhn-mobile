//
// Created by Dee Madden on 2/5/14.
// Copyright (c) 2014 Dee Madden. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface UIViewController (UIStoryboard)

+ (id)viewControllerWithIdentifier:(NSString*)identifier inStoryboard:(UIStoryboard*)storyboard;
+ (instancetype)viewControllerInStoryboard:(UIStoryboard*)storyboard; // use class name as identifier

+ (id)viewControllerWithIdentifier:(NSString*)identifier inStoryboardNamed:(NSString*)storyboardName;
+ (instancetype)viewControllerInStoryboardNamed:(NSString*)storyboardName; // use class name as identifier

@end