#import <CoreData/CoreData.h>
#import "GetScavItemsRequestOperation.h"
#import "CoreDataContextSingleton.h"
#import "ScavItem.h"
#import "Scav.h"
#import "Player.h"
#import "PlayerLog.h"


@implementation GetScavItemsRequestOperation

- (void)start {
  if (![self startingExecution])
    return;

  // Fetch the scavItems out of Core Data.  First, we need to create our own context
  NSError* error = nil;
  NSManagedObjectContext* context = [[NSManagedObjectContext alloc] init];
  context.persistentStoreCoordinator = [[CoreDataContextSingleton sharedInstance] persistentStoreCoordinator];

  // Figure out which Scav the Player Picked
  NSString* decodedUrl = [self.request.URL.path stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
  NSRegularExpression* regex = [NSRegularExpression regularExpressionWithPattern:@".*users/([a-zA-Z-_]+)/scavs/([a-zA-Z-_]+)" options:NSRegularExpressionCaseInsensitive error:&error];

  NSString* playerName = [regex stringByReplacingMatchesInString:decodedUrl options:0 range:NSMakeRange(0, [decodedUrl length]) withTemplate:@"$1"];
  NSString* scavName = [regex stringByReplacingMatchesInString:decodedUrl options:0 range:NSMakeRange(0, [decodedUrl length]) withTemplate:@"$2"];

  // Verify the player selected a scav and actually started a game
  NSPredicate* playerFilter = [NSPredicate predicateWithFormat:@"scavName == %@ AND playerParent.name == %@", scavName, playerName];
  PlayerLog* playerLogForCurrentScav = [[[CoreDataContextSingleton sharedInstance]
                                            getEntityObjectsOfType:@"PlayerLog"
                                                     withPredicate:playerFilter
                                                       withContext:context
                                                         withError:&error] firstObject];

  if (error != nil || !playerLogForCurrentScav)
  {
    Log4ObjC(@"GetScavItemsRequestOperation: FAILURE! Player begin record not found.  error = %@", error);
    [self finishedExecutionWithStatus:501 andJSONResponseObject:nil];
    return;
  }

  NSPredicate* scavFilter = [NSPredicate predicateWithFormat:@"name == %@ AND status == %@", scavName, @"INPROGRESS"];

  Scav* scavWereLookingFor = [[[CoreDataContextSingleton sharedInstance]
                                  getEntityObjectsOfType:@"Scav"
                                           withPredicate:scavFilter
                                             withContext:context withError:&error] firstObject];

  if (error != nil || !scavWereLookingFor)
  {
    Log4ObjC(@"GetScavItemsRequestOperation: FAILURE! error = %@", error);
    [self finishedExecutionWithStatus:501 andJSONResponseObject:nil];
    return;
  }

  // The scavItems array we've got is an array of ScavItem NSManagedObjects,
  // So we need to convert the whole collection back to Objective-C
  // primitive objects before we can return it as JSON
  // to the javascript
  [self convertScavsToJsonAndRespond:scavWereLookingFor];
}

- (void)convertScavsToJsonAndRespond:(Scav *)scavWereLookingFor
{
  NSMutableArray* scavItems = [NSMutableArray array];

  for (ScavItem* scavItem in scavWereLookingFor.scavItems)
    {
      @autoreleasepool
      {
        NSDictionary* scavItemJSON = @{
            @"name" : scavItem.name,
            @"pointValue" : [scavItem.pointValue stringValue],
            @"pointColor" : scavItem.pointColor,
            @"hint" : scavItem.hint,
            @"level" : scavWereLookingFor.level,
            @"thumbnail" : scavItem.thumbnail,
            @"thumbnailType" : scavItem.thumbnailType,
            @"status" : scavItem.status,
            @"coordinates" : scavItem.coordinates,
            @"_id" : scavItem.scavItemId
        };

        [scavItems addObject:scavItemJSON];
      }
    };

  NSDictionary* scavJsonToReturnBackToJS = @{
      @"status" : scavWereLookingFor.status,
      @"name" : scavWereLookingFor.name,
      @"_id" : scavWereLookingFor.scavId,
      @"items" : scavItems
    };

  [self finishedWithSuccessStatusAndJSONResponseObject:scavJsonToReturnBackToJS];
}

@end