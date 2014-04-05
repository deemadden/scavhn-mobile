//
//
// Copyright (c) 2013 SoftSource. All rights reserved.
//


#import <Foundation/Foundation.h>


@interface JsCommander : NSObject

- (void)messageToJS:(NSString*)jsCall;
- (void)sendJSAction:(NSString *)action withData:(id)data;

@end