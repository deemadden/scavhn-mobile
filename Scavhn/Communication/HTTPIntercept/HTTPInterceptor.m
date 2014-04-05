//
//  HTTPInterceptor.m
//
//
//

#import "HTTPInterceptor.h"
#import "HTTPRequestMapManager.h"
#import "HTTPRequestOperation.h"
#import "GlobalConstants.h"

@interface HTTPInterceptor ()
{
  NSOperationQueue* _operationQueue;
  NSURLRequest* _request;
  
  NSURLConnection* _connection;
}

@property (nonatomic, assign) BOOL requestWasReceived;
@property (nonatomic, assign) BOOL requestWasSkipped;
@property (nonatomic, assign) BOOL requestHasFinished;

- (NSURLConnection*)connectionWithRequest:(NSURLRequest*)request;

@end

@implementation HTTPInterceptor

+ (BOOL)canInitWithRequest:(NSURLRequest *)request
{
  NSString * requestProtocol = [[request URL] scheme];
  // allow both http and https requests
  return (([requestProtocol isEqualToString:@"http"] || [requestProtocol isEqualToString:@"https"])
          && [request valueForHTTPHeaderField:HTTP_PASSTHRU_HEADER_FLAG] == nil);
}

+ (NSURLRequest *)canonicalRequestForRequest:(NSURLRequest *)request
{
    return request;
}

- (id)initWithRequest:(NSURLRequest *)request
       cachedResponse:(NSCachedURLResponse *)cachedResponse
               client:(id <NSURLProtocolClient>)client
{
  // Modify request so we don't loop
  NSMutableURLRequest *mutableRequest = [request mutableCopy];
  [mutableRequest setValue:@"TRUE" forHTTPHeaderField:HTTP_PASSTHRU_HEADER_FLAG];
  
  if (self = [super initWithRequest:mutableRequest cachedResponse:cachedResponse client:client])
  {
    _operationQueue = [[NSOperationQueue alloc] init];
    _request = mutableRequest;
    _requestWasReceived = NO;
    _requestWasSkipped = NO;
    _requestHasFinished = NO;
  }
  
  return self;
}

-(HTTPRequestMapManager *)httpRequestMapManager
{
  return _httpRequestMapManager ?: [HTTPRequestMapManager sharedInstance];
}

- (void)startLoading
{
  _requestWasReceived = YES;
  
  HTTPRequestOperation* operation = [self.httpRequestMapManager httpRequestOperationForURLRequest:_request];

  if(operation)
  {
    Log4ObjC(@"HTTP INTERCEPTOR HANDLING REQUEST - %@ %@ -> %@", _request.HTTPMethod, _request.URL, [operation class]);

    // Farm out the request to an Objective-C handler based on the URL
    [_operationQueue addOperation:operation];
    
    operation.delegate = self;
    
    _requestWasSkipped = NO;
  }
  else
  {
    Log4ObjC(@"HTTP INTERCEPTOR SKIPPING REQUEST - %@ %@", _request.HTTPMethod, _request.URL);
    
    // Go get the data on behalf of the client
    _connection = [self connectionWithRequest:_request];
    
    _requestWasSkipped = YES;
  }
}

- (void)stopLoading
{
  [_connection cancel];
  _connection = nil;
}

- (NSURLConnection*)connectionWithRequest:(NSURLRequest*)request
{
  return [[NSURLConnection alloc] initWithRequest:_request delegate:self];
}

- (void)operationComplete:(HTTPRequestOperation*)operation
{
  _requestHasFinished = YES;
  
  if([operation.response.response isKindOfClass:[NSHTTPURLResponse class]])
    Log4ObjC(@"HTTP INTERCEPTOR RESPONDING TO %@ WITH STATUS %d", operation.request.URL.absoluteString, [(NSHTTPURLResponse*)operation.response.response statusCode]);
  
  // Return the response to the client
  [self.client URLProtocol:self didReceiveResponse:operation.response.response cacheStoragePolicy:NSURLCacheStorageNotAllowed];
  [self.client URLProtocol:self didLoadData:operation.response.data];
  [self.client URLProtocolDidFinishLoading:self];
}

#pragma mark - NSURLConnection

- (void)connection:(NSURLConnection *)connection didReceiveData:(NSData *)data
{
  [self.client URLProtocol:self didLoadData:data];
}

- (void)connection:(NSURLConnection *)connection didFailWithError:(NSError *)error
{
  _requestHasFinished = YES;
  
  [self.client URLProtocol:self didFailWithError:error];
  _connection = nil;
}

- (void)connection:(NSURLConnection *)connection didReceiveResponse:(NSURLResponse *)response
{
  [self.client URLProtocol:self didReceiveResponse:response cacheStoragePolicy:NSURLCacheStorageAllowed];  // Feel free to cache anything we don't respond to
}

- (void)connectionDidFinishLoading:(NSURLConnection *)connection
{
  _requestHasFinished = YES;
  
  [self.client URLProtocolDidFinishLoading:self];
  _connection = nil;
}

@end
