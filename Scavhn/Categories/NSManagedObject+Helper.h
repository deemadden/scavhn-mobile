//
//  NSManagedObject+Helper.h
//
//
//
//

#import <CoreData/CoreData.h>

@interface NSManagedObject (Helper)

- (instancetype)inContext:(NSManagedObjectContext*)context;
- (instancetype)inMainContext;

@end
