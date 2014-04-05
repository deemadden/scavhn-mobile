//
//  scavhnViewController.m
//  Scavhn
//
//
//  Copyright (c) 2013 SoftSource. All rights reserved.
//

#import <CoreLocation/CoreLocation.h>
#import "ScavhnViewController.h"
#import "ScavsDataStore.h"
#import "CoreDataContextSingleton.h"
#import "WebServicesManager.h"

@interface ScavhnViewController ()

@property(nonatomic, strong) CLLocationManager* locationManager;
@property(nonatomic, strong) NSDictionary *locationManagerCurrentPosition;

@end

@implementation ScavhnViewController

- (void)viewDidLoad
{
  [super viewDidLoad];
  // Do any additional setup after loading the view, typically from a nib.
  self.webView = [self.view asObjectOfClass:[UIWebView class]];
  [self.webView setShadowImagesHidden:YES];
  self.webView.scrollView.showsHorizontalScrollIndicator = NO;
  self.webView.scrollView.showsVerticalScrollIndicator = NO;
  // FOR "MAKING HYBRID DELIGHTFUL" Discussion
  // self.webView.scrollView.bounces = NO;

  if([[NSUserDefaults standardUserDefaults] boolForKey:@"disconnectcaching"])
  {
    if([[NSUserDefaults standardUserDefaults] boolForKey:@"cleancache"])
    {
      Log4ObjC(@"Clean cache was turned on.  Deleting the records from Core Data.");
      [[CoreDataContextSingleton sharedInstance] wipeOutCoreData:@"ScavsDownload"];
      [[CoreDataContextSingleton sharedInstance] wipeOutCoreData:@"Player"];
    }

    NSError* getCountError = nil;

    NSNumber* scavDownloadCount = [[CoreDataContextSingleton sharedInstance] getCountForObjectsOfType:@"ScavsDownload"
                                                                                        withPredicate:nil
                                                                                          withContext:[[CoreDataContextSingleton sharedInstance] managedObjectContext]
                                                                                            withError:&getCountError];

    Log4ObjC(@"scavDownloadCount %@", scavDownloadCount);

    if(scavDownloadCount.intValue == 0)
    {
      NSURLSessionTask* downloadTask = [WebServicesManager retrieveAllScavsDataWithCompletionBlock:^(id json, NSError* error)
      {
         if(!error)
         {
           NSError* saveError = nil;

           // Convert the JSON response to Core Data Objects and save to Core Data Model
           [ScavsDataStore saveAllScavsJsonToCoreData:json withError:&saveError];

           [self loadWebView];
         }
      }];

      Log4ObjC(@"downloadTask Request %@", downloadTask.originalRequest);
    }
    else
    {
      Log4ObjC(@"I have data cached already!");
      [self loadWebView];
    }
  }
  else
  {
    [self loadWebView];
  }

  // Bootstrap CoreLocation services
  [self setupLocationManager];
}

- (void)didReceiveMemoryWarning
{
  [super didReceiveMemoryWarning];
  // Dispose of any resources that can be recreated.
}

- (void)setupLocationManager
{
  self.locationManager = [[CLLocationManager alloc] init];
  self.locationManager.delegate = self;
  self.locationManager.desiredAccuracy = kCLLocationAccuracyBest;
  self.locationManager.distanceFilter = kCLDistanceFilterNone;
}

#pragma public methods for CoreLocation services
- (void)startLocationServices
{
  [self.locationManager startUpdatingLocation];
}

- (void)stopLocationServices
{
  [self.locationManager stopUpdatingLocation];
}

- (NSDictionary *)retrieveCurrentPositionFromLocationServices
{
  return self.locationManagerCurrentPosition;
}


#pragma mark CLLocation delegates
// Delegate method from the CLLocationManagerDelegate protocol.
- (void)locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray *)locations
{
  CLLocation* location = [locations lastObject];
  NSDate* eventDate = location.timestamp;
  NSTimeInterval howRecent = [eventDate timeIntervalSinceNow];

  if (abs((int)howRecent) < 5.0)
  {
    self.locationManagerCurrentPosition = @{
        @"latitude" : [@(location.coordinate.latitude) stringValue],
        @"longitude" : [@(location.coordinate.longitude) stringValue],
        @"heading" : [@(location.course) stringValue],
        @"altitude" : [@(location.altitude) stringValue],
        @"horizontalAccuracy" : [@(location.horizontalAccuracy) stringValue],
        @"verticalAccuracy" : [@(location.verticalAccuracy) stringValue]
    };
  }
}

#pragma mark - Delegates
-(UIStatusBarStyle)preferredStatusBarStyle
{
  return UIStatusBarStyleLightContent;
}

#pragma mark - Helpers
- (void)loadWebView
{
  NSString* htmlPath = [[NSBundle mainBundle] pathForResource:@"web/index" ofType:@"html"];
  [self.webView loadRequest:[NSURLRequest requestWithURL:[NSURL fileURLWithPath:htmlPath isDirectory:NO]]];
}

- (void)sendJSCallToWebView:(NSString*)jsCall
{
  dispatch_async(dispatch_get_main_queue(), ^{
    [self.webView stringByEvaluatingJavaScriptFromString:jsCall];
  });
}

@end
