//
//  HTTPInterceptor.h
//
//
//

#import <Foundation/Foundation.h>
#import "HTTPRequestOperation.h"

@class HTTPRequestMapManager;

@interface HTTPInterceptor : NSURLProtocol <NSURLConnectionDelegate, NSURLConnectionDataDelegate, OperationDelegate>

@property (nonatomic, strong) HTTPRequestMapManager * httpRequestMapManager;
-(BOOL)requestWasReceived;
-(BOOL)requestWasSkipped;
-(BOOL)requestHasFinished;

@end
