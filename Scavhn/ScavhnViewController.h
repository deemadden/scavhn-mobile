//
//  scavhnViewController.h
//  Scavhn
//
//
//  Copyright (c) 2013 SoftSource. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <CoreLocation/CoreLocation.h>

@interface ScavhnViewController : UIViewController <CLLocationManagerDelegate>

@property (nonatomic, strong) IBOutlet UIWebView* webView;

- (void)startLocationServices;
- (void)sendJSCallToWebView:(NSString*)jsCall;

- (NSDictionary *)retrieveCurrentPositionFromLocationServices;

- (void)stopLocationServices;
@end
