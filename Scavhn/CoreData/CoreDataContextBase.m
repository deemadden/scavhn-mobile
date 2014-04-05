//
//  CoreDataContextBase.m
//
//
//

#import "CoreDataContextBase.h"
#import "NSManagedObjectContext+Saving.h"

@interface CoreDataContextBase ()
- (NSString*)databaseFileName;
@end

@implementation CoreDataContextBase

#pragma mark Core Data functions

- (NSManagedObjectContext *)managedObjectContext 
{
  if(_managedObjectContext == nil)
  {
    NSPersistentStoreCoordinator *coordinator = [self persistentStoreCoordinator];

    if (coordinator != nil)
    {
      _managedObjectContext = [[NSManagedObjectContext alloc] initWithConcurrencyType:NSMainQueueConcurrencyType];
      [_managedObjectContext setPersistentStoreCoordinator:coordinator];
    }
  }

  return _managedObjectContext;
}

- (NSManagedObjectModel *)managedObjectModel
{
    
  if (_managedObjectModel != nil)
  {
      return _managedObjectModel;
  }
  
  _managedObjectModel = [NSManagedObjectModel mergedModelFromBundles:nil];

  return _managedObjectModel;
}

- (NSPersistentStoreCoordinator *)persistentStoreCoordinator
{
  if (_persistentStoreCoordinator != nil)
  {
      return _persistentStoreCoordinator;
  }

  NSURL *storeURL = [self databaseURL];

  NSError *error = nil;
  _persistentStoreCoordinator = [[NSPersistentStoreCoordinator alloc] initWithManagedObjectModel:[self managedObjectModel]];

  if (![_persistentStoreCoordinator addPersistentStoreWithType:NSSQLiteStoreType 
                                                 configuration:nil 
                                                           URL:storeURL 
                                                       options:@{NSMigratePersistentStoresAutomaticallyOption: @YES, 
                                                                NSInferMappingModelAutomaticallyOption: @YES} 
                                                         error:&error])
  {
    // Warn the user that we'll be shutting down due to an inability to upgrade the DB
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Database Error"
                                                    message:@"Your existing database is incompatible with this version of the app. Please uninstall this version and install the new version."
                                                   delegate:self
                                          cancelButtonTitle:@"OK"
                                          otherButtonTitles:nil]; // Released in button responder
    [alert show];

    Log4ObjC(@"Unresolved Core Data error %@, %@. Likely caused by existing database being unupgradable.", error, [error userInfo]);
    
    return nil;
  }
  
  return _persistentStoreCoordinator;
}

- (void)refreshManagedObjectContext
{  
  NSManagedObjectContext *context = [self managedObjectContext];
  for (NSManagedObject *obj in [context registeredObjects])
  {
    [context refreshObject:obj mergeChanges:NO];
  }
}

- (NSManagedObjectContext*)createBackgroundContext
{
  NSManagedObjectContext *context = [[NSManagedObjectContext alloc] initWithConcurrencyType:NSPrivateQueueConcurrencyType];
  [context setPersistentStoreCoordinator:[self persistentStoreCoordinator]];
  
  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(backgroundContextDidSave:) name:NSManagedObjectContextDidSaveNotification object:context];
  
  return context;
}

- (void)backgroundContextDidSave:(NSNotification*)notification
{
  if ([NSThread isMainThread])
  {
    [[self managedObjectContext] mergeChangesFromContextDidSaveNotification:notification];
    return;
  }
  
  // merge synchronously to avoid race conditions
  dispatch_sync(dispatch_get_main_queue(), ^{
    [[self managedObjectContext] mergeChangesFromContextDidSaveNotification:notification];
  });
}

- (void)saveInBackground:(BOOL(^)(NSManagedObjectContext *context, NSError **pError))block
{
  [self saveInBackground:block withCompletion:nil];
}

- (void)saveInBackground:(BOOL(^)(NSManagedObjectContext *context, NSError **pError))block withCompletion:(void(^)(BOOL success, NSError *error))completion
{
  NSManagedObjectContext *context = [self createBackgroundContext];
  
  [context performBlock:^{
    
    if (block)
    {
      NSError *error = nil;
      BOOL success = block(context, &error);
      if (!success || error)
      {
        dispatch_async(dispatch_get_main_queue(), ^{
          completion(NO, error);
        });
      }
    }
    
    [context saveToStoreWithCompletion:completion];
  }];
}

#pragma mark -

- (void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex
{
  RELEASE_SAFELY(alertView);
  abort();
}

#pragma mark - Accessors

- (NSString*)databaseFileName
{
  return [NSString stringWithFormat:@"%@.sqlite", self.sqliteDBBaseFileName];
}

- (NSURL*)databaseURL
{
  return [APP_DOC_DIR_URL URLByAppendingPathComponent:[self databaseFileName]];
}

- (NSString*)databaseFileLocation
{
  return [APP_DOC_DIR stringByAppendingPathComponent:[self databaseFileName]];
}

#pragma mark - Abstract methods

- (NSString*) coreDataModelBaseFileName { return nil; }
- (NSString*) sqliteDBBaseFileName { return nil; }

@end
