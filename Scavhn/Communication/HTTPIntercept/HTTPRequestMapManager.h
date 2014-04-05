//
//  HTTPRequestMapManager.h
//
//
//

#import <Foundation/Foundation.h>

@class HTTPRequestOperation;

@interface HTTPRequestMapManager : NSObject

- (HTTPRequestOperation*)httpRequestOperationForURLRequest:(NSURLRequest*)request;

- (void)addMappingFromMethod:(NSString*)method andURLPattern:(NSString*)urlPattern toClassName:(NSString*)className;
- (void)removeMappingForMethod:(NSString*)method andURLPattern:(NSString*)urlPattern;
- (void)mapChangedEnvironmentDomain:(NSString*)environment;

+ (HTTPRequestMapManager *)sharedInstance;

@end
