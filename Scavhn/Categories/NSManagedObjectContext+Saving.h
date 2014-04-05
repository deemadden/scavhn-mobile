//
//  NSManagedObjectContext+Saving.h
//
//
//
//

#import <CoreData/CoreData.h>

@interface NSManagedObjectContext (Saving)

- (BOOL)saveToStore:(NSError**)pError;
- (void)saveToStoreWithCompletion:(void(^)(BOOL success, NSError *error))completion;

@end
