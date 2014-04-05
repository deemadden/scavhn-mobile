//
// Created by Dee Madden on 2/5/14.
// Copyright (c) 2014 Dee Madden. All rights reserved.
//

#import "UIViewController+UIStoryboard.h"
#import "NSObject+Casting.h"

@implementation UIViewController (UIStoryboard)

+ (instancetype)viewControllerInStoryboard:(UIStoryboard*)storyboard
{
  return [[self viewControllerWithIdentifier:NSStringFromClass(self) inStoryboard:storyboard] asObjectOfClass:self];
}

+ (instancetype)viewControllerInStoryboardNamed:(NSString*)storyboardName
{
  return [[self viewControllerWithIdentifier:NSStringFromClass(self) inStoryboardNamed:storyboardName] asObjectOfClass:self];
}

+ (id)viewControllerWithIdentifier:(NSString*)identifier inStoryboard:(UIStoryboard*)storyboard
{
  return [storyboard instantiateViewControllerWithIdentifier:identifier];
}

+ (id)viewControllerWithIdentifier:(NSString*)identifier inStoryboardNamed:(NSString*)storyboardName
{
  UIStoryboard *storyboard = [UIStoryboard storyboardWithName:storyboardName bundle:nil];
  return [storyboard instantiateViewControllerWithIdentifier:identifier];
}

@end