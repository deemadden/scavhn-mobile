//
//  Logger.m
//
//
//

#import "Logger.h"
#import "FileSystemHelper.h"

#define DATE_FORMAT_FILE @"yyyyMMdd_HHmmssSSS"
#define DATE_FORMAT_LOG_ENTRY @"yyyy-MM-dd HH:mm:ss.SSS"

@implementation Logger

- (id)init
{
  self = [super init];
  if (self)
  {
    [self prepForLogging];
  }

  return self;
}

- (void)prepForLogging
{
  [self initializeLogFileGlobals];

  NSString* logFolder = @"Logs";
  [FileSystemHelper cleanFolderUnderDocuments:logFolder];

  NSString* logFolderPath = [FileSystemHelper createDirectoryIfNotExists:logFolder];
  NSString* logFileRootName = @"Log4ObjC_";
  
  NSDateFormatter* df = [[NSDateFormatter alloc] init];
  df.dateFormat = DATE_FORMAT_FILE;

  _logFileName = [NSString stringWithFormat:@"%@%@.txt", logFileRootName, [df stringFromDate:[NSDate date]]];
  
  RELEASE_SAFELY(df);
  
  _logFileFullPath = [NSString stringWithFormat:@"%@/%@", logFolderPath, _logFileName];
  
  if(![[NSFileManager defaultManager] fileExistsAtPath:_logFileFullPath])
  {
    [[NSFileManager defaultManager] createFileAtPath:_logFileFullPath contents:nil attributes:nil];
  }
  
  _logFileHandle = [NSFileHandle fileHandleForWritingAtPath:_logFileFullPath];
  [_logFileHandle seekToEndOfFile];

  NSString *const logMessage = @"DAS Logging started!\n";
  [self logToFile:logMessage];
}

- (void)log4NSLogAndFile:(NSString *)messageToLog
{
  if(messageToLog)
  {
    @autoreleasepool
    {
      NSString* dateTimeStamp = [_dateFormatter stringFromDate:[NSDate date]];
      NSString* logMessage4File = [NSString stringWithFormat:@"%@\t%@\n", dateTimeStamp, messageToLog];
      
      [self logToFile:logMessage4File];
      
      NSLog(@"%@", messageToLog);
    }
  }
}

- (void)logToFile:(NSString *)logMessage
{
  [_logFileHandle writeData:[logMessage dataUsingEncoding:NSUTF8StringEncoding]];
  [_logFileHandle synchronizeFile];
}

- (void)initializeLogFileGlobals
{
  _dateFormatter = [[NSDateFormatter alloc] init];
  _dateFormatter.dateFormat = DATE_FORMAT_LOG_ENTRY;
  
  _logFileName = nil;
  _logFileFullPath = nil;
  _logFileHandle = nil;
}

#pragma mark - Singleton Functions
+ (Logger *)sharedInstance
{
  // SS: There's a chance that this can be instantiated more than once
  //   because it's not thread-safe. Not a likely scenario for the app, but seems
  //   to happen in tests. Commenting out mutex as it slows things way down
//  @synchronized([Logger class])
//  {
  static dispatch_once_t onceToken;
  static Logger* instance;
  
  dispatch_once(&onceToken, ^{
    instance = [[Logger alloc] init];
  });
  
  return instance;
//  }
}

#pragma mark - Memory management

- (void)dealloc
{
  [_logFileHandle synchronizeFile];
  [_logFileHandle closeFile];
}

@end
