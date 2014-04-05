//
//  HTTPRequestMapManager.m
//
//
//

#import "HTTPRequestMapManager.h"
#import "HTTPRequestOperation.h"

static NSString *const HTTPMethodGET    = @"GET";
static NSString *const HTTPMethodPUT    = @"PUT";
static NSString *const HTTPMethodPOST   = @"POST";
static NSString *const HTTPMethodDELETE = @"DELETE";

static NSString *const kPatternDataClassKey = @"class";
static NSString *const kPatternDataRegexKey = @"regex";


/*!
 The HTTPRequestMap is organized first by HTTP Method and then by pattern. 
 Each pattern sub-dictionary contains the operation class and the regular expression 
 object corresponding to the pattern (kPatternDataClassKey, kPatternDataRegexKey).
 
 httpRequestMap = {
      HTTPMethodGET: {
          "^/scavhn/scavs/[0-9,]+/vulture\\$": {
              kPatternDataClassKey: [DownloadAssortmentsCancelRequestOperation class],
              kPatternDataRegexKey: [NSRegularExpression regularExpressionWithPattern:"^/das/retailers...
          }
      }
 }
 
*/

@interface HTTPRequestMapManager ()

@property (nonatomic, strong) NSMutableDictionary* httpRequestMap;
@property (nonatomic, strong) NSString* environmentBaseURLString;

+ (NSString*)loadEnvironmentBaseURLFromSettings;

@end

@implementation HTTPRequestMapManager

#pragma mark Initialization

- (id)init
{
    if(self = [super init])
    {        
      Log4ObjC(@"HTTPRequestMapManager: This is a singleton.  Do not try to initialize directly.");
        
      _httpRequestMap = [[NSMutableDictionary alloc] init];
      _environmentBaseURLString = [HTTPRequestMapManager loadEnvironmentBaseURLFromSettings];

      // This intercept needs to happen connected or not.
      // We may add this to the REST server so that we're saving pics to the backend as well,
      // But that's out of scope for now.
      [self addMappingFromMethod:HTTPMethodPOST
                   andURLPattern:@"^/scavhn/v1/api/users/[a-zA-Z-_]+/scavs/[a-zA-Z-_]+/items/tocameraroll$"
                     toClassName:@"SaveScavItemPictureTakenToCameraRoll"];

      /* ===========================================
       NATIVE IMPLEMENTATION OF THE PICTURE-TAKING
       PORTION OF THE CAMERA VIEW - Web Service Call
       Begin
       =========================================== */
      [self addMappingFromMethod:HTTPMethodPUT
                   andURLPattern:@"^/scavhn/v1/api/native/users/[a-zA-Z-_]+/scavs/[a-zA-Z0-9-_]+/items/[a-zA-Z0-9-_]+$"
                     toClassName:@"ScavItemNativeVerifyRequestOperation"];

      if([[NSUserDefaults standardUserDefaults] boolForKey:@"disconnectcaching"])
      {
        [self addMappingFromMethod:HTTPMethodGET
                    andURLPattern:@"^/scavhn/v1/api/scavs$"
                      toClassName:@"GetScavsRequestOperation"];

        [self addMappingFromMethod:HTTPMethodPOST
                     andURLPattern:@"^/scavhn/v1/api/users/[a-zA-Z-_]+/scavs/[a-zA-Z-_]+$"
                       toClassName:@"SaveScavGameBeginRequestOperation"];

        [self addMappingFromMethod:HTTPMethodGET
                     andURLPattern:@"^/scavhn/v1/api/users/[a-zA-Z-_]+/scavs/[a-zA-Z-_]+$"
                       toClassName:@"GetScavItemsRequestOperation"];


        // http://10.0.1.6:3000/scavhn/v1/api/users/timmypickens/scavs/52ec12623b0c5a380d000003/items/52eab68e133a6be3cfca519c
        [self addMappingFromMethod:HTTPMethodPUT
                    andURLPattern:@"^/scavhn/v1/api/users/[a-zA-Z-_]+/scavs/[a-zA-Z0-9-_]+/items/[a-zA-Z0-9-_]+$"
                      toClassName:@"ScavItemVerifyRequestOperation"];
      }
      else
      {
        [self removeMappingForMethod:HTTPMethodGET andURLPattern:@"^/scavhn/scavs$"];
      }
    }
  
    return self;
}

#pragma mark - Map Alertations

- (void)addMappingFromMethod:(NSString*)method andURLPattern:(NSString*)urlPattern toClassName:(NSString*)className
{
  NSParameterAssert(method);
  NSParameterAssert(urlPattern);
  NSParameterAssert(className);
  
  NSError* err;
  NSRegularExpression* regex = [NSRegularExpression regularExpressionWithPattern:urlPattern options:NSRegularExpressionCaseInsensitive error:&err];
  Class operationClass = NSClassFromString(className);
  
  if (!regex || !operationClass)
  {
    Log4ObjC(@"ERROR: could not add mapping for method%@, pattern:%@ -> regex:%@, className:%@ -> class:%@", method, urlPattern, regex, className, operationClass);
    return;
  }
  
  [self mappingsForMethod:method][urlPattern] = @{
                                                    kPatternDataClassKey: operationClass,
                                                    kPatternDataRegexKey: regex
                                                  };
}

- (void)removeMappingForMethod:(NSString*)method andURLPattern:(NSString*)urlPattern
{
  NSParameterAssert(method);
  NSParameterAssert(urlPattern);
  
  [[self mappingsForMethod:method] removeObjectForKey:urlPattern];
}

- (NSMutableDictionary*)mappingsForMethod:(NSString*)method
{
  method = [method uppercaseString];
  
  if (!_httpRequestMap[method])
    _httpRequestMap[method] = [[NSMutableDictionary alloc] init];
  
  return _httpRequestMap[method];
}

#pragma mark - Factory method

- (HTTPRequestOperation*)httpRequestOperationForURLRequest:(NSURLRequest*)request
{
  if (!request || request.URL.path.length == 0)
    return nil;
  
  HTTPRequestOperation* rtn = nil;
  
  NSString *urlPath = request.URL.path;
  NSRange urlPathRange = NSMakeRange(0, request.URL.path.length);
  
  // Loop through the whole map and see if this URL path matches a stored regex
  NSDictionary *patternMap = [self mappingsForMethod:request.HTTPMethod];
  for(NSDictionary *patternData in [patternMap objectEnumerator])
  {    
    // Check to see if the requested method and URL match this entry in the map
    if([patternData[kPatternDataRegexKey] numberOfMatchesInString:urlPath options:0 range:urlPathRange] <= 0)
      continue;
    
    // Override the base URL with the user's settings (as necessary)
    if(_environmentBaseURLString)
    {
      // Get the parts of the original URL that follow /scavhn/ and append them to our overriding URL
      NSArray* originalURLPathParts = [[request.URL absoluteString] componentsSeparatedByString:@"/scavhn/"];
      if([originalURLPathParts count] > 1)
      {
        NSMutableURLRequest* mutableRequest = [request mutableCopy];
        
        // Reconstruct the final, overridden URL
        [mutableRequest setURL:[NSURL URLWithString:[NSString stringWithFormat:@"%@/%@", _environmentBaseURLString, originalURLPathParts[1]]]];
        
        request = mutableRequest;
      }
    }
    
    // Return the matching operation
    rtn = [[patternData[kPatternDataClassKey] alloc] init];
    rtn.request = request;
    
    break;
  }
  
  return rtn;
}

#pragma mark - Helper functions

- (void)mapChangedEnvironmentDomain:(NSString*)environment
{
  _environmentBaseURLString = [HTTPRequestMapManager loadEnvironmentBaseURLFromSettings];
}

+ (NSString*)loadEnvironmentBaseURLFromSettings
{
  return [[NSUserDefaults standardUserDefaults] stringForKey:@"environment"];
}

#pragma mark - Singleton

+ (HTTPRequestMapManager *)sharedInstance
{
  static dispatch_once_t onceToken;
  static HTTPRequestMapManager * instance;
  
  dispatch_once(&onceToken, ^{
    instance = [[HTTPRequestMapManager alloc] init];
  });
  
  return instance;
}

@end
