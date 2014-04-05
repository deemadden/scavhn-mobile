//
//
// Copyright (c) 2013 SoftSource. All rights reserved.
//

#import <CoreLocation/CoreLocation.h>
#import "ScavItemVerifyRequestOperation.h"
#import "JSONHelper.h"
#import "CoreDataContextSingleton.h"
#import "ScavItem.h"
#import "NSManagedObjectContext+Saving.h"


@implementation ScavItemVerifyRequestOperation

- (void)start
{
	if (![self startingExecution])
  	return;

  NSError* error = nil;

  // Create a context to connect to Core Data
  NSManagedObjectContext* context = [[NSManagedObjectContext alloc] init];
  context.persistentStoreCoordinator = [[CoreDataContextSingleton sharedInstance] persistentStoreCoordinator];

  // Figure out which Scav the Player Picked
  NSString* decodedUrl = [self.request.URL.path stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
  NSRegularExpression* regex = [NSRegularExpression regularExpressionWithPattern:@".*users/([a-zA-Z-_]+)/scavs/([a-zA-Z0-9-_]+)/items/([a-zA-Z0-9-_]+)" options:NSRegularExpressionCaseInsensitive error:&error];

  NSString* playerName = [regex stringByReplacingMatchesInString:decodedUrl options:0 range:NSMakeRange(0, [decodedUrl length]) withTemplate:@"$1"];
  NSString* scavId = [regex stringByReplacingMatchesInString:decodedUrl options:0 range:NSMakeRange(0, [decodedUrl length]) withTemplate:@"$2"];
  NSString* scavItemId = [regex stringByReplacingMatchesInString:decodedUrl options:0 range:NSMakeRange(0, [decodedUrl length]) withTemplate:@"$3"];

  // Get the changes from the HTTP request body
  NSString* requestBodyJSONString = [[NSString alloc] initWithBytes:self.request.HTTPBody.bytes length:self.request.HTTPBody.length encoding:NSUTF8StringEncoding];
  NSDictionary* requestBodyJSONDict = [JSONHelper decodeJSON:requestBodyJSONString];

  NSString* scavItemName = requestBodyJSONDict[@"scavItemName"];
  NSString* heading = requestBodyJSONDict[@"heading"];
  NSDictionary* coordinates = requestBodyJSONDict[@"coordinates"];
  NSString* latitude = coordinates[@"latitude"];
  NSString* longitude = coordinates[@"longitude"];
  NSString* altitude = requestBodyJSONDict[@"altitude"];
  NSString* altitudeAccuracy = requestBodyJSONDict[@"altitudeAccuracy"];
  NSString* accuracy = requestBodyJSONDict[@"accuracy"];

  Log4ObjC(@"ScavItemVerifyRequestOperation:");
  Log4ObjC(@"player: %@", playerName);
  Log4ObjC(@"scavId: %@", scavId);
  Log4ObjC(@"scavItemId: %@", scavItemId);
  Log4ObjC(@"scavItemName: %@", scavItemName);
  Log4ObjC(@"heading: %@", heading);
  Log4ObjC(@"coordinates: %@", coordinates);
  Log4ObjC(@"altitude: %@", altitude);
  Log4ObjC(@"altitudeAccuracy: %@", altitudeAccuracy);
  Log4ObjC(@"accuracy: %@", accuracy);

  NSPredicate* scavItemFilter = [NSPredicate predicateWithFormat:@"scavItemId == %@ AND scavParent.scavId == %@ AND name == %@", scavItemId, scavId, scavItemName];
  ScavItem* scavItemPlayerIsLookingFor = [[[CoreDataContextSingleton sharedInstance] getEntityObjectsOfType:@"ScavItem" withPredicate:scavItemFilter withContext:context withError:&error] firstObject];
  NSString* scavLevel = [[[CoreDataContextSingleton sharedInstance] getEntityObjectProperties:@[@"level"] fromType:@"Scav" whereField:@"scavId" equals:scavId withContext:context withError:&error] firstObject];

  // Found Info
  CLLocation* locationFound;

  CLLocationCoordinate2D clCoordinate;
  clCoordinate.latitude = (CLLocationDegrees)latitude.doubleValue;
  clCoordinate.longitude = (CLLocationDegrees)longitude.doubleValue;

  CLLocationDistance clAltitude = altitude.doubleValue;
  CLLocationAccuracy clVerticalAccuracy = altitudeAccuracy.doubleValue;

  CLLocationAccuracy clHorizontalAccuracy = accuracy.doubleValue;

  // To Find Info
  CLLocationCoordinate2D clCoordinateToFind;
  clCoordinateToFind.latitude = (CLLocationDegrees)[scavItemPlayerIsLookingFor.coordinates[@"latitude"] doubleValue];
  clCoordinateToFind.longitude = (CLLocationDegrees)[scavItemPlayerIsLookingFor.coordinates[@"longitude"] doubleValue];

  CLLocation* locationToFind = [[CLLocation alloc] initWithLatitude:clCoordinateToFind.latitude longitude:clCoordinateToFind.longitude];

  if(![heading isKindOfClass:[NSNull class]])
  {
    CLLocationDirection course = heading.doubleValue;
    locationFound = [[CLLocation alloc] initWithCoordinate:clCoordinate
                                             altitude:clAltitude
                                   horizontalAccuracy:clHorizontalAccuracy
                                     verticalAccuracy:clVerticalAccuracy
                                               course:course
                                                speed:(CLLocationSpeed)0.0
                                            timestamp:[NSDate date]];
  }
  else
  {
    locationFound = [[CLLocation alloc] initWithCoordinate:clCoordinate
                                             altitude:clAltitude
                                   horizontalAccuracy:clHorizontalAccuracy
                                     verticalAccuracy:clVerticalAccuracy
                                            timestamp:[NSDate date]];
  }

  // Now try and calculate the distance
  CLLocationDistance distanceFromItemFound = [locationFound distanceFromLocation:locationToFind];

  Log4ObjC(@"\n\nScav Item distance from Scav Item Found by Player: %f\n\n", distanceFromItemFound);

  if(![scavItemName isEqualToString:@"Lego House"])
  {
    scavItemPlayerIsLookingFor.status = @"FOUND";
    [context saveToStore:&error];
  }

  NSDictionary* scavItemJsonToReturnBackToJS = @{
    @"_id" : scavItemPlayerIsLookingFor.scavItemId,
      @"coordinates" : scavItemPlayerIsLookingFor.coordinates,
      @"hint" : scavItemPlayerIsLookingFor.hint,
      @"level" : scavLevel,
      @"name" : scavItemPlayerIsLookingFor.name,
      @"pointColor" : scavItemPlayerIsLookingFor.pointColor,
      @"pointValue" : scavItemPlayerIsLookingFor.pointValue,
      @"status" : scavItemPlayerIsLookingFor.status,
      @"thumbnail" : scavItemPlayerIsLookingFor.thumbnail,
      @"thumbnailType" : scavItemPlayerIsLookingFor.thumbnailType
  };

  if(error == nil && ![scavItemPlayerIsLookingFor.name isEqualToString:@"Lego House"])
  {
    RELEASE_SAFELY(context);

    [self finishedWithSuccessStatusAndJSONResponseObject:scavItemJsonToReturnBackToJS];
  }
  else
  {
    RELEASE_SAFELY(context);

    NSDictionary* errorResponse = @{
      @"error" : @{
            @"message" : @"You hit the bad seed.  Lego House can never be found!"
        }
    };

    [self finishedExecutionWithStatus:500 andJSONResponseObject:errorResponse];
  }
}

@end