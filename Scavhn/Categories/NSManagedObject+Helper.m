//
//  NSManagedObject+Helper.m
//
//
//
//

#import "NSManagedObject+Helper.h"
#import "CoreDataContextSingleton.h"

@implementation NSManagedObject (Helper)

- (instancetype)inContext:(NSManagedObjectContext*)context
{
  if (context == self.managedObjectContext)
    return self;
  
  return [context objectWithID:self.objectID];
}

- (instancetype)inMainContext
{
  return [self inContext:[CoreDataContextSingleton sharedInstance].managedObjectContext];
}

@end
