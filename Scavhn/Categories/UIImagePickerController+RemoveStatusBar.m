//
// Created by Dee Madden on 2/6/14.
// Copyright (c) 2014 Dee Madden. All rights reserved.
//

#import "UIImagePickerController+RemoveStatusBar.h"


@implementation UIImagePickerController (RemoveStatusBar)

- (void)viewDidLoad
{
  [super viewDidLoad];

  // Remedy for hiding status bar post-iOS7
  if (floor(NSFoundationVersionNumber) > NSFoundationVersionNumber_iOS_6_1)
  {
    self.edgesForExtendedLayout = UIRectEdgeNone;

    [self prefersStatusBarHidden];
    [self performSelector:@selector(setNeedsStatusBarAppearanceUpdate)];
  }
}

- (BOOL)prefersStatusBarHidden
{
  return YES;
}

- (UIViewController *)childViewControllerForStatusBarHidden
{
  return nil;
}

@end