//
//  GlobalConstants.h
//  Scavhn
//
//
//  Copyright (c) 2013 SoftSource. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "Logger.h"

#pragma mark Utils

#pragma mark Utils

#if __has_feature(objc_arc)

#define RELEASE_SAFELY(__POINTER) { __POINTER = nil; }
#define RELEASE_SAFELY_WITH_DELEGATE(__POINTER) { __POINTER.delegate = nil; __POINTER = nil; }
#define AUTORELEASE_SAFELY(__POINTER) { __POINTER = nil; }
#define AUTORELEASE_SAFELY_WITH_DELEGATE(__POINTER) { __POINTER.delegate = nil; __POINTER = nil; }

#if __IPHONE_OS_VERSION_MIN_REQUIRED >= 60000   // iOS 6.0 or later
#define NEEDS_DISPATCH_RETAIN_RELEASE 0
#else                                           // iOS 5.X or earlier
  #define NEEDS_DISPATCH_RETAIN_RELEASE 1
#endif

#else
//# warning file should be compiled with ARC

#define RELEASE_SAFELY(__POINTER) { [__POINTER release]; __POINTER = nil; }
#define RELEASE_SAFELY_WITH_DELEGATE(__POINTER) { if(__POINTER) __POINTER.delegate = nil; [__POINTER release]; __POINTER = nil; }
#define AUTORELEASE_SAFELY(__POINTER) { [__POINTER autorelease]; __POINTER = nil; }
#define AUTORELEASE_SAFELY_WITH_DELEGATE(__POINTER) { if(__POINTER) __POINTER.delegate = nil; [__POINTER autorelease]; __POINTER = nil; }

#define NEEDS_DISPATCH_RETAIN_RELEASE 1

#endif

#define Log4ObjC(fmt, ...) ({ [[Logger sharedInstance] log4NSLogAndFile:[NSString stringWithFormat:fmt, ##__VA_ARGS__]]; })

#pragma mark - Application Folders

#define APP_DOC_DIR_URL [[[NSFileManager defaultManager] URLsForDirectory:NSDocumentDirectory inDomains:NSUserDomainMask] lastObject]
#define APP_DOC_DIR [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0]

#pragma mark - Preferences Constants

#define HTTP_PASSTHRU_HEADER_FLAG @"X-HTTP-PASSTHRU"

@interface GlobalConstants : NSObject

@end
