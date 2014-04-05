//
//  CoreDataContextSingleton.m
//
//
//

#import "CoreDataContextSingleton.h"
#import "CoreDataHelper.h"
#import "JSONHelper.h"
#import "FileSystemHelper.h"

@interface CoreDataContextSingleton ()

@end

@implementation CoreDataContextSingleton

- (id)init
{
    if(self = [super init])
    {
      Log4ObjC(@"CoreDataContextSingleton: This is a singleton.  Do not try to initialize directly.");
    }
    
    return self;
}

- (NSString*) coreDataModelBaseFileName 
{ 
    return @"ScavhnModel";
}

- (NSString*) sqliteDBBaseFileName 
{ 
    return @"ScavhnModel";
}

#pragma mark - Helper functions

- (NSArray*)getEntityObjectsOfType:(NSString*)entityName
                       withContext:(NSManagedObjectContext*)context
                         withError:(NSError**)pError
{
  NSFetchRequest* fetchRequest = [[NSFetchRequest alloc] initWithEntityName:entityName];
  return [context executeFetchRequest:fetchRequest error:pError];
}

- (NSArray*)getEntityObjectsOfType:(NSString*)entityName
                     withPredicate:(NSPredicate*)predicate
                       withContext:(NSManagedObjectContext*)context
                         withError:(NSError**)pError
{
  NSFetchRequest* fetchRequest = [[NSFetchRequest alloc] initWithEntityName:entityName];
  [fetchRequest setPredicate:predicate];
  
  return [context executeFetchRequest:fetchRequest error:pError];
}

- (NSArray *)getEntityObjectsOfType:(NSString*)entityName
                         whereField:(NSString*)fieldName
                             equals:(id)value 
                        withContext:(NSManagedObjectContext*)context
                          withError:(NSError**)pError
{
  NSPredicate* predicate = [NSPredicate predicateWithFormat:@"%K == %@", fieldName, value];
  return [self getEntityObjectsOfType:entityName withPredicate:predicate withContext:context withError:pError];
}

- (NSNumber*)getCountForObjectsOfType:(NSString*)entityName
                        withPredicate:(NSPredicate*)predicate
                          withContext:(NSManagedObjectContext*)context
                            withError:(NSError**)pError
{
  NSFetchRequest* fetchRequest = [[NSFetchRequest alloc] initWithEntityName:entityName];

  if(predicate)
    [fetchRequest setPredicate:predicate];
  
  NSUInteger count = [context countForFetchRequest:fetchRequest error:pError];
  return (count == NSNotFound? nil : @(count));
}

- (NSArray *)getEntityObjectProperties:(NSArray*)properties
                              fromType:(NSString*)entityName
                         withPredicate:(NSPredicate*)predicate
                           withContext:(NSManagedObjectContext*)context
                             withError:(NSError**)pError
{
  NSFetchRequest* fetchRequest = [[NSFetchRequest alloc] initWithEntityName:entityName];
  [fetchRequest setResultType:NSDictionaryResultType];
  [fetchRequest setPropertiesToFetch:properties];
  [fetchRequest setPredicate:predicate];

  return [context executeFetchRequest:fetchRequest error:pError];
}

- (NSArray *)getEntityObjectProperties:(NSArray*)properties
                              fromType:(NSString*)entityName
                            whereField:(NSString*)fieldName
                                equals:(id)value
                           withContext:(NSManagedObjectContext*)context
                             withError:(NSError**)pError
{
  NSPredicate* predicate = [NSPredicate predicateWithFormat:@"%K == %@", fieldName, value];
  return [self getEntityObjectProperties:properties fromType:entityName withPredicate:predicate withContext:context withError:pError];
}

- (void)wipeOutCoreData:(NSString *)topLevelEntity
{
  NSManagedObjectContext* coreDataContext = [[CoreDataContextSingleton sharedInstance] managedObjectContext];

  NSError *error = nil;
  NSFetchRequest *fetchRequest = [[NSFetchRequest alloc] init];

  NSEntityDescription *entity = [NSEntityDescription entityForName:topLevelEntity inManagedObjectContext:coreDataContext];

  [fetchRequest setEntity:entity];

  NSArray *items = [coreDataContext executeFetchRequest:fetchRequest error:&error];

  for (NSManagedObject *managedObject in items) {
      [coreDataContext deleteObject:managedObject];
  }

  if (![coreDataContext save:&error]) {
      NSLog(@"Error deleting %@ - error:%@",@"Everything", error);
  }
}

+ (NSError*)genericError
{
  return [NSError errorWithDomain:@"com.softsource.Scavhn" code:1 userInfo:nil];
}

#pragma mark - Singleton Functions

+ (CoreDataContextSingleton *)sharedInstance
{
  static dispatch_once_t onceToken;
  static CoreDataContextSingleton * instance;
  
  dispatch_once(&onceToken, ^{
    instance = [[CoreDataContextSingleton alloc] init];
  });
  
  return instance;
}

@end
