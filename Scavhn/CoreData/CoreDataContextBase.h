//
//  CoreDataContextBase.h
//
//
//

#import <Foundation/Foundation.h>
#import <CoreData/CoreData.h>

@interface CoreDataContextBase : NSObject <UIAlertViewDelegate>
{
    NSManagedObjectContext* _managedObjectContext;
    NSManagedObjectModel* _managedObjectModel;
    NSPersistentStoreCoordinator* _persistentStoreCoordinator;
}

@property (nonatomic, strong, readonly) NSManagedObjectContext* managedObjectContext;
@property (nonatomic, strong, readonly) NSManagedObjectModel* managedObjectModel;
@property (nonatomic, strong, readonly) NSPersistentStoreCoordinator* persistentStoreCoordinator;

@property(nonatomic, strong, readonly) NSString* coreDataModelBaseFileName;  // Abstract. Should be overridden by subclass
@property(nonatomic, strong, readonly) NSString* sqliteDBBaseFileName;  // Abstract. Should be overridden by subclass

- (NSURL*)databaseURL;
- (NSString*)databaseFileLocation;

- (void)refreshManagedObjectContext;
- (NSManagedObjectContext*)createBackgroundContext;

/*!
 Convenience methods for performing CoreData operations in a background thread.
 
 @param block   This block will get called in a private queue associated with the 'context' parameter it
 receives. All CoreData operations inside the block should use this particular context. Returning NO or 
 setting a non-nil value in *pError will abort the operation and execute the completion handler with an 
 error status. Returning YES will cause the context to be saved and the completion block to be called.
 
 @param completion  This block will be called on the main queue after executing the 'block' action and saving the context.
 */
- (void)saveInBackground:(BOOL(^)(NSManagedObjectContext *context, NSError **pError))block;
- (void)saveInBackground:(BOOL(^)(NSManagedObjectContext *context, NSError **pError))block withCompletion:(void(^)(BOOL success, NSError *error))completion;

@end
