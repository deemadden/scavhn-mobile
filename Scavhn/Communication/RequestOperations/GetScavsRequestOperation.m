//
//
// Copyright (c) 2013 SoftSource. All rights reserved.
//


#import <CoreData/CoreData.h>
#import "GetScavsRequestOperation.h"
#import "CoreDataContextSingleton.h"
#import "Scav.h"
#import "NSArray+Functional.h"


@implementation GetScavsRequestOperation

- (void)start
{
	if (![self startingExecution])
  	return;

  // Fetch the scavs out of Core Data.  First, we need to create our own context
  NSManagedObjectContext* context = [[NSManagedObjectContext alloc] init];
  context.persistentStoreCoordinator = [[CoreDataContextSingleton sharedInstance] persistentStoreCoordinator];

  // Now gather them up
  NSError* error = nil;
  NSArray* scavs = [[CoreDataContextSingleton sharedInstance] getEntityObjectsOfType:@"Scav" withContext:context withError:&error];

  if(error != nil || !scavs || [scavs count] == 0)
  {
    Log4ObjC(@"GetScavsRequestOperation: FAILURE! scavs.count = %d -- error = %@", scavs.count, error);
    [self finishedExecutionWithStatus:501 andJSONResponseObject:nil];
    return;
  }

  // The scavs array we've got is an array of Scav NSManagedObjects,
  // So we need to convert the whole collection back to Objective-C
  // primitive objects before we can return it as JSON
  // to the javascript
  NSMutableArray* scavsJSON = [NSMutableArray array];

  for(Scav* scav in scavs)
  {
    @autoreleasepool
    {
      NSDictionary* scavJSON = @{
                                    @"description" : scav.scavDescription,
                                    @"_id" : scav.scavId,
                                    @"image" : scav.image,
                                    @"imageType" : scav.imageType,
                                    @"level" : scav.level,
                                    @"name" : scav.name,
                                    @"items" : @"null",
                                    @"duration" : scav.duration,
                                    @"thumbnail" : scav.thumbnail,
                                    @"thumbnailType" : scav.thumbnailType
                                };

      [scavsJSON addObject:scavJSON];
    }
  };

  [self finishedWithSuccessStatusAndJSONResponseObject:scavsJSON];
}

@end