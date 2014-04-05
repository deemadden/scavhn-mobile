//
//  FileSystemHelper.h
//
//
//

#import <Foundation/Foundation.h>

@interface FileSystemHelper : NSObject

+ (NSString *)createDirectoryIfNotExists:(NSString *)folderName;
+ (NSString *)fullFilePathUnderDocumentsForFile:(id)fileName;
+ (BOOL)cleanFolderUnderDocuments:(NSString *)folderName;
+ (BOOL)deleteFile:(NSString *)filePath;

@end
