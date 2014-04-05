//
//  FileSystemHelper.m
//
//
//

#import "FileSystemHelper.h"

@implementation FileSystemHelper

+ (NSString *)createDirectoryIfNotExists:(NSString *)folderName
{
  NSError* error;
  BOOL wasDirCreated;
  BOOL isDir;
  
  NSFileManager *fileManager = [[NSFileManager alloc] init];

  NSString *directory = [self fullFilePathUnderDocumentsForFile:folderName];

  if (!([fileManager fileExistsAtPath:directory isDirectory:&isDir] && isDir))
  {
    wasDirCreated = [fileManager createDirectoryAtPath:directory withIntermediateDirectories:YES attributes:nil error:&error];

    if(!wasDirCreated)
    {
      NSLog(@"Error creating temporary directory: %@", error);
      directory = nil;
    }
  }
  
  return directory;
}

+ (NSString *)fullFilePathUnderDocumentsForFile:(NSString *)fileName
{
  return [APP_DOC_DIR stringByAppendingPathComponent:fileName];
}

// Returns true if the folder was successfully cleaned out. Returns false if the directory doesn't exist,
//   or there was an error deleting one of the sub files
+ (BOOL)cleanFolderUnderDocuments:(NSString *)folderName
{
  NSString* folderToClean = [self fullFilePathUnderDocumentsForFile:folderName];
  NSString* file;
  BOOL isDir;
  
  BOOL fileDeleteSucceeded = YES;

  NSFileManager* fileManager = [[NSFileManager alloc] init];

  if (![fileManager fileExistsAtPath:folderToClean isDirectory:&isDir] || !isDir)
    return NO;
  
  NSDirectoryEnumerator* directoryInfo = [fileManager enumeratorAtPath:folderToClean];
  NSError* error = nil;

  while ((file = [directoryInfo nextObject]))
  {
    fileDeleteSucceeded = [fileManager removeItemAtPath:[folderToClean stringByAppendingPathComponent:file] error:&error];
    if (!fileDeleteSucceeded || error)
    {
      NSLog(@"fileDelete Failed: %@", error);
      fileDeleteSucceeded = NO;
    }
  }
  
  return fileDeleteSucceeded;
}

// Returns true if the file was deleted, or if the file wasn't there to start. Returns FALSE otherwise
+ (BOOL)deleteFile:(NSString *)filePath
{
  BOOL fileExists = [[NSFileManager defaultManager] fileExistsAtPath:filePath];

  if (!fileExists)
    return YES;
  
  return [[NSFileManager defaultManager] removeItemAtPath:filePath error:nil];
}

@end
