//
//  Logger.h
//  DAS
//
//
//

#import <Foundation/Foundation.h>

@interface Logger : NSObject
{
  NSDateFormatter* _dateFormatter;
  
  NSString* _logFileName;
  NSString* _logFileFullPath;
  NSFileHandle* _logFileHandle;
}

+ (Logger*)sharedInstance;
- (void)log4NSLogAndFile:(NSString *)messageToLog;

@end
