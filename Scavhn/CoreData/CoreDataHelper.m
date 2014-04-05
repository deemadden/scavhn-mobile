//
//  CoreDataHelpers.m
//
//
//

#import "CoreDataHelper.h"

@implementation CoreDataHelper

+ (id)nilIfNSNull:(id)obj
{
  return ([obj class] == [NSNull class]) ? nil : obj;
}

+ (NSString*)objectToString:(id)object
{
  if ([object isKindOfClass:[NSString class]])
    return object;
  
  if ([object isKindOfClass:[NSNumber class]])
  {
    if (strcmp([object objCType], @encode(BOOL)) == 0)
      return [object boolValue] ? @"true" : @"false";

    static NSNumberFormatter *formatter = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
      formatter = [[NSNumberFormatter alloc] init];
      
      [formatter setAllowsFloats:YES];
      [formatter setMaximumFractionDigits:2];
    });

    return [formatter stringFromNumber:object];
  }

  return nil;
}

+ (NSNumber*)objectToNumber:(id)object
{
  if([object isKindOfClass:[NSNumber class]])
    return object;
  
  if([object isKindOfClass:[NSString class]])
  {
    static NSNumberFormatter *formatter = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
      formatter = [[NSNumberFormatter alloc] init];
    });
    
    return [formatter numberFromString:object];
  }
  
  return nil;
}

+ (NSString*)arrayToCsvString:(id)object
{
  if([object isKindOfClass:[NSArray class]])
    return [object componentsJoinedByString:@","];

  return nil;
}

+ (NSString*)formatDate:(NSDate*)date
{
  static NSDateFormatter *dateFormatter = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    dateFormatter = [[NSDateFormatter alloc] init];
    [dateFormatter setDateFormat:@"MMM dd, yyyy hh:mm a"];
  });

  return [dateFormatter stringFromDate:date];
}

+ (NSString*)formatDateTimeMillis:(NSDate*)date
{
  static NSDateFormatter *dateFormatter = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    dateFormatter = [[NSDateFormatter alloc] init];
    [dateFormatter setDateFormat:@"yyyy-MM-dd HH:mm:ss.AAA"];
  });

  return [dateFormatter stringFromDate:date];
}

+ (NSString*)dateToDateString:(NSDate*)date
{
  date = [self nilIfNSNull:date];
  
  static NSDateFormatter *dateFormatter = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    dateFormatter = [[NSDateFormatter alloc] init];
    [dateFormatter setDateFormat:@"yyyy-MM-dd"];
  });
  
  return [dateFormatter stringFromDate:date];
}
+ (NSDate *)dateStringToDate:(NSString *)date
{
  date = [self nilIfNSNull:date];
  
  static NSDateFormatter *dateFormatter = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    dateFormatter = [[NSDateFormatter alloc] init];
    [dateFormatter setDateFormat:@"yyyy-MM-dd"];
  });

  return [dateFormatter dateFromString:date];
}

+ (NSDate *)dateStringToDateTime:(NSString *)date
{
  date = [self nilIfNSNull:date];
  
  static NSDateFormatter *dateFormatter = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    dateFormatter = [[NSDateFormatter alloc] init];
    [dateFormatter setDateFormat:@"MMM dd, yyyy hh:mm a"];
  });
  
  return [dateFormatter dateFromString:date];
}

+ (NSDate *)dateStringToDateTimeMillis:(NSString *)date
{
  date = [self nilIfNSNull:date];

  static NSDateFormatter *dateFormatter = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    dateFormatter = [[NSDateFormatter alloc] init];
    [dateFormatter setDateFormat:@"yyyy-MM-dd HH:mm:ss.S"];
  });
  
  return [dateFormatter dateFromString:date];
}

@end
