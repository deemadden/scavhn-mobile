//
//  NSManagedObjectContext+Saving.m
//
//
//
//

#import "NSManagedObjectContext+Saving.h"

@implementation NSManagedObjectContext (Saving)

- (BOOL)saveToStore:(NSError**)pError
{
  if (pError) *pError = nil;
  
  if (![self hasChanges])
    return YES;
  
  __block NSError *error = nil;
  __block BOOL success = [self save:&error];
  
  if (!success)
  {
    Log4ObjC(@"ERROR: Context Save Failed: %@, %@", error, [error userInfo]);
  }
  else
  {
    [self.parentContext performBlockAndWait:^{
      success = [self.parentContext saveToStore:&error];
    }];
  }
  
  if (pError) *pError = error;
  
  return success;
}

- (void)saveToStoreWithCompletion:(void(^)(BOOL success, NSError *error))completion
{
  void (^callCompletion)(BOOL, NSError*) = ^(BOOL success, NSError *error) {
    if (completion)
    {
      dispatch_async(dispatch_get_main_queue(), ^{
        completion(success, error);
      });
    }
  };
  
  if (![self hasChanges])
  {
    callCompletion(YES, nil);
    return;
  }
  
  [self performBlock:^{
    
    NSError *error = nil;
    BOOL success = [self save:&error];
    
    if (!success)
    {
      Log4ObjC(@"ERROR: Context Save Failed: %@, %@", error, [error userInfo]);
      callCompletion(NO, error);
      return;
    }
    
    if (self.parentContext)
    {
      [self.parentContext saveToStoreWithCompletion:completion];
    }
    else
    {
      callCompletion(YES, error);
    }
  }];
}

@end
