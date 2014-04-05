//
//  CoreDataContextBase.h
//
//
//

#import "CoreDataContextBase.h"

@interface CoreDataContextSingleton : CoreDataContextBase

+ (CoreDataContextSingleton *)sharedInstance;

- (NSArray*)getEntityObjectsOfType:(NSString*)entityName
                       withContext:(NSManagedObjectContext*)context
                         withError:(NSError**)pError;

- (NSArray*)getEntityObjectsOfType:(NSString*)entityName 
                     withPredicate:(NSPredicate*)predicate 
                       withContext:(NSManagedObjectContext*)context 
                         withError:(NSError**)pError;

- (NSArray*)getEntityObjectsOfType:(NSString*)entityName 
                        whereField:(NSString *)fieldName 
                            equals:(id)value 
                       withContext:(NSManagedObjectContext*)context
                         withError:(NSError**)pError;

- (NSNumber*)getCountForObjectsOfType:(NSString*)entityName
                        withPredicate:(NSPredicate*)predicate
                          withContext:(NSManagedObjectContext*)context
                            withError:(NSError**)pError;

- (NSArray *)getEntityObjectProperties:(NSArray*)properties
                              fromType:(NSString*)entityName
                         withPredicate:(NSPredicate*)predicate
                           withContext:(NSManagedObjectContext*)context
                             withError:(NSError**)pError;

- (NSArray *)getEntityObjectProperties:(NSArray*)properties
                              fromType:(NSString*)entityName
                            whereField:(NSString*)fieldName
                                equals:(id)value
                           withContext:(NSManagedObjectContext*)context
                             withError:(NSError**)pError;

- (void)wipeOutCoreData:(NSString *)topLevelEntity;

+ (NSError*)genericError;

@end
