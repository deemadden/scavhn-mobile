//
//
// Copyright (c) 2013 SoftSource. All rights reserved.
//


#import "JsCommander.h"
#import "UIApplication+Scavhn.h"
#import "ScavhnAppDelegate.h"
#import "ScavhnViewController.h"
#import "JSONHelper.h"

static NSString* const kJSBridge = @"window.App.getInstance().mediatorBridge('%@', '%@')";

@implementation JsCommander

- (void)sendJSAction:(NSString *)action withData:(id)data
{
  NSString* jsonData;
  NSString* scrubbedJsonData = @"";

  if(data)
  {
    jsonData = [JSONHelper encodeJSON:data asCompactAndSerialized:YES];
//	NSString *jsonData = @"{\"sortOrder\":69,\"productType\":\"newProductType\"}";

    scrubbedJsonData = jsonData;
    scrubbedJsonData = [scrubbedJsonData stringByReplacingOccurrencesOfString:@"\\" withString:@"\\\\"];
    scrubbedJsonData = [scrubbedJsonData stringByReplacingOccurrencesOfString:@"\"" withString:@"\\\""];
    scrubbedJsonData = [scrubbedJsonData stringByReplacingOccurrencesOfString:@"\'" withString:@"\\\'"];
    scrubbedJsonData = [scrubbedJsonData stringByReplacingOccurrencesOfString:@"\r" withString:@"\\r"];
    scrubbedJsonData = [scrubbedJsonData stringByReplacingOccurrencesOfString:@"\f" withString:@"\\f"];
  }

  NSString* jsCall = [NSString stringWithFormat:kJSBridge, action, scrubbedJsonData];

  [self messageToJS:jsCall];
}

- (void)messageToJS:(NSString*)jsCall
{
  [[[UIApplication sharedApplication] appDelegate].scavhnViewController sendJSCallToWebView:jsCall];
}

@end