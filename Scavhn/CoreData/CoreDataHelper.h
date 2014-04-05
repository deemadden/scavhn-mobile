//
//  CoreDataHelpers.h
//
//
//

#import <Foundation/Foundation.h>

@interface CoreDataHelper : NSObject

+ (id)nilIfNSNull:(id)obj;
+ (NSString*)objectToString:(id)object;
+ (NSNumber*)objectToNumber:(id)object;
+ (NSString*)arrayToCsvString:(id)object;
+ (NSString*)formatDate:(NSDate*)date;
+ (NSString*)formatDateTimeMillis:(NSDate*)date;
+ (NSString*)dateToDateString:(NSDate*)date;
+ (NSDate *)dateStringToDate:(NSString *)date;
+ (NSDate *)dateStringToDateTime:(NSString *)date;
+ (NSDate *)dateStringToDateTimeMillis:(NSString *)date;

@end
