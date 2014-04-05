//
//  HTTPRequestOperation.h
//
//
//

#import <Foundation/Foundation.h>
#import "HTTPRequestOperation.h"
#import "ScavhnAppDelegate.h"
#import	"ScavhnViewController.h"

@class HTTPRequestOperation;

@protocol OperationDelegate <NSObject>

- (void)operationComplete:(HTTPRequestOperation*)op;

@end

@interface HTTPRequestOperation : NSOperation

@property (nonatomic, weak) id <OperationDelegate>  delegate;

@property (nonatomic, strong) NSURLRequest* request;
@property (nonatomic, strong, readonly) NSCachedURLResponse* response;

+ (NSString*)jsonpCallbackFunction:(NSURL*)url;

- (id)initWithRequest:(NSURLRequest*)aRequest;

- (BOOL)startingExecution;

- (void)finishedWithSuccessStatusAndJSONResponseObject:(id)object;
- (void)finishedExecutionWithStatus:(unsigned int)status andJSONResponseString:(NSString*)jsonResponseStr;
- (void)finishedExecutionWithStatus:(unsigned int)status andJSONResponseObject:(id)object;

@end
