//
//  HTTPRequestOperation.m
//
//
//

#import "HTTPRequestOperation.h"
#import "HTTPInterceptor.h"
#import "ScreenSleepManager.h"
#import "JSONHelper.h"

@interface HTTPRequestOperation ()

@property (nonatomic, assign) BOOL isExecuting;
@property (nonatomic, assign) BOOL isFinished;

@end

@implementation HTTPRequestOperation

- (id)init
{
    return [self initWithRequest:nil];
}

- (id)initWithRequest:(NSURLRequest*)aRequest
{
    if(self = [super init])
    {
      _isExecuting = NO;
      _isFinished = NO;
      
      self.request = aRequest;
    }
    return self;
}

- (void)setRequest:(NSURLRequest *)request
{
  if (request)
  {
      NSMutableURLRequest* mutableRequest = [request mutableCopy];
      request = mutableRequest;
  }

  _request = request;
}

- (BOOL)isReady
{
    return YES;
}

- (BOOL)startingExecution
{
  [self willChangeValueForKey:@"isExecuting"];
  _isExecuting = YES;
  [self didChangeValueForKey:@"isExecuting"];
  
  // Don't turn the screen off while we're downloading data
  [[ScreenSleepManager sharedInstance] addRequest];

  return YES;
}

- (void)finishedWithSuccessStatusAndJSONResponseObject:(id)object
{
  [self finishedExecutionWithStatus:200 andJSONResponseObject:object];
}

- (void)finishedExecutionWithStatus:(unsigned int)status andJSONResponseObject:(id)object
{
  Log4ObjC(@"\n\nsuper finishedExecutionWithStatus called.\n\n");
  NSString* jsonString = object ? [JSONHelper encodeJSON:object asCompactAndSerialized:NO] : nil;
  [self finishedExecutionWithStatus:status andJSONResponseString:jsonString];
}

- (void)finishedExecutionWithStatus:(unsigned int)status andJSONResponseString:(NSString*)jsonResponseStr
{
  NSData* data = nil;

  // Build a response body for any standard codes,
  // As well as a special "not found" code, 700,
  // that Scavhn knows about,
  // so that a response body can be handed back to the
  // web client through the XHR header
  if(status < 400 || status == 700)
  {
    // Is there a callback? 
    NSString* jsonCallbackFunction = [HTTPRequestOperation jsonpCallbackFunction:self.request.URL];
    if(jsonCallbackFunction && jsonCallbackFunction.length > 0)
        jsonResponseStr = [NSString stringWithFormat:@"%@(%@)", jsonCallbackFunction, jsonResponseStr];
    
    // Package it all up
    data = [jsonResponseStr dataUsingEncoding:NSUTF8StringEncoding];
  }
  
  // Create a timestamp for the Expires header
  NSTimeInterval secondsPerDay = 24 * 60 * 60;
  NSDate* tomorrow = [NSDate dateWithTimeIntervalSinceNow:secondsPerDay];
  NSDateFormatter* dateFormatter = [[NSDateFormatter alloc] init];
  [dateFormatter setDateFormat:@"EEE, dd MMM yyyy HH:mm:ss zzz"];
  
  // Create the response
  NSDictionary* responseHeaders = @{@"Expires": [dateFormatter stringFromDate:tomorrow],
                                   @"Content-Length": [NSString stringWithFormat:@"%u", data.length],
                                   @"Content-Type": @"application/json",
                                   @"Cache-control": @"no-cache"};
  
  NSHTTPURLResponse* response = [[NSHTTPURLResponse alloc] initWithURL:self.request.URL statusCode:status HTTPVersion:@"HTTP/1.1" headerFields:responseHeaders];
  
  _response = [[NSCachedURLResponse alloc] initWithResponse:response data:data];
  
  [self.delegate operationComplete:self];
  
  [self willChangeValueForKey:@"isExecuting"];
  _isExecuting = NO;
  [self didChangeValueForKey:@"isExecuting"];

  [self willChangeValueForKey:@"isFinished"];
  _isFinished = YES;
  [self didChangeValueForKey:@"isFinished"];
  
  // Ask to turn the screen sleep back off
  [[ScreenSleepManager sharedInstance] removeRequest];
}

+ (NSString*)jsonpCallbackFunction:(NSURL*)url
{
    // Break query up in to array of alternating variables, values
    NSArray* varsAndVals = [url.query componentsSeparatedByCharactersInSet:[NSCharacterSet characterSetWithCharactersInString:@"&="]];
    
    int n = varsAndVals.count;
    for(int i = 0 ; i < n ; i+=2)
    {
        if([varsAndVals[i] isEqual:@"callback"])
            return varsAndVals[i+1];
    }
    
    return nil; 
}

@end
