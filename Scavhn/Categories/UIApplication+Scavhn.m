//
//
// Copyright (c) 2013 SoftSource. All rights reserved.
//


#import "UIApplication+Scavhn.h"
#import "ScavhnAppDelegate.h"
#import "ScavhnViewController.h"

@implementation UIApplication (Scavhn)

- (ScavhnAppDelegate *)appDelegate
{
  return (ScavhnAppDelegate *)[self delegate];
}

- (ScavhnViewController*)scavhnViewController
{
  return [[self appDelegate] scavhnViewController];
}

@end