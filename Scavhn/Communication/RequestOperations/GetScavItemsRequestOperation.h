#import <Foundation/Foundation.h>
#import "AsyncHTTPRequestOperation.h"

@class Scav;

@interface GetScavItemsRequestOperation : AsyncHTTPRequestOperation

- (void)convertScavsToJsonAndRespond:(Scav *)scavWereLookingFor;

@end
