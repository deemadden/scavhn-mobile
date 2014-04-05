//
//  ScreenSleepManager.m
//
//
//
//

#import "ScreenSleepManager.h"

@implementation ScreenSleepManager

- (id)init
{
  if(self = [super init])
  {
    _currentRequestCount = 0;
    _counterLock = [[NSLock alloc] init];
  }
  
  return self;
}

+ (ScreenSleepManager*)sharedInstance
{
  static dispatch_once_t onceToken;
  static ScreenSleepManager* instance;
  
  dispatch_once(&onceToken, ^{
    instance = [[ScreenSleepManager alloc] init];
  });
  
  return instance;
}

- (void)addRequest
{
  [_counterLock lockBeforeDate:[NSDate dateWithTimeIntervalSinceNow:60]];
  
  _currentRequestCount++;
  
  // Don't allow the screen to dim if this is the first concurrent request to dim it
  if (_currentRequestCount == 1)
    [[UIApplication sharedApplication] setIdleTimerDisabled:YES];
  
  [_counterLock unlock];
}

- (void)removeRequest
{
  [_counterLock lockBeforeDate:[NSDate dateWithTimeIntervalSinceNow:60]];
  
  _currentRequestCount--;
  if(_currentRequestCount < 0)
    _currentRequestCount = 0;
  
  // Allow the screen to dim if this is the last concurrent request to dim it
  if (_currentRequestCount == 0)
    [[UIApplication sharedApplication] setIdleTimerDisabled:NO];
  
  [_counterLock unlock];
}

@end
