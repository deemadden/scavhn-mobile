//
//  ScreenSleepManager.h
//
//
//
//

#import <Foundation/Foundation.h>

@interface ScreenSleepManager : NSObject
{
  int _currentRequestCount; // WARNING: only access this from within a lock block
  NSLock* _counterLock;
}

+ (ScreenSleepManager*)sharedInstance;

- (void)addRequest;
- (void)removeRequest;

@end
