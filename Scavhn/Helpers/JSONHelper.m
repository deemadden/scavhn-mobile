//
//  JSONHelper.m
//
//
//

#import "JSONHelper.h"

@implementation JSONHelper

+ (NSString *)encodeJSON:(id)jsonObject
{
  return [self encodeJSON:jsonObject asCompactAndSerialized:NO];
}
+ (NSString *)encodeJSON:(id)jsonObject asCompactAndSerialized:(BOOL)shouldBeCompact
{
  if (!jsonObject)
    return nil;
  
	if (![NSJSONSerialization isValidJSONObject:jsonObject])
  {
    Log4ObjC(@"This object cannot be tranlated into JSON: %@", jsonObject);
    return nil;
  }
  
  NSJSONWritingOptions options = shouldBeCompact? 0 : NSJSONWritingPrettyPrinted;
  
  NSError* parseError = nil;
  NSData* jsonData = [NSJSONSerialization dataWithJSONObject:jsonObject options:options error:&parseError];
  
  return [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
}

+ (BOOL)encodeJSON:(id)jsonObject toFile:(NSString*)filePath
{
  if (!jsonObject || [filePath length] == 0)
    return NO;
  
	if (![NSJSONSerialization isValidJSONObject:jsonObject])
  {
    Log4ObjC(@"This object cannot be tranlated into JSON: %@", jsonObject);
    return NO;
  }
  
  NSOutputStream *stream = [NSOutputStream outputStreamToFileAtPath:filePath append:NO];
  [stream open];
  
  NSError *error;
  NSUInteger bytes = (NSUInteger)[NSJSONSerialization writeJSONObject:jsonObject toStream:stream options:0 error:&error];
  [stream close];
  
  if (bytes == 0 || error)
  {
    Log4ObjC(@"Error when writing to file %@", filePath);
    return NO;
  }
  
  return YES;
}

+ (id)decodeJSON:(NSString*)jsonString
{
  if (jsonString == nil)
    return nil;
  
  NSData* jsonData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
  NSError* parseError;
  return [NSJSONSerialization JSONObjectWithData:jsonData options:0 error:&parseError];
}

+ (id)decodeJSONFromFile:(NSString*)filePath
{
  if ([filePath length] == 0)
    return nil;
  
  NSInputStream *stream = [NSInputStream inputStreamWithFileAtPath:filePath];
  [stream open];
  
  NSError *error;
  id jsonObject = [NSJSONSerialization JSONObjectWithStream:stream options:0 error:&error];
  [stream close];
  
  if (!jsonObject || error)
  {
    Log4ObjC(@"Error when reading from file %@", filePath);
    return nil;
  }
  
  return jsonObject;
}

+ (void)foundationObjectsToNSLog:(id)jSonObject withIndetation:(NSString *)indent
{
	if ([jSonObject isKindOfClass:[NSDictionary class]])
		for (NSString *key in jSonObject) {
			Log4ObjC(@"%@Dictionary: %@", indent, key);
			[self foundationObjectsToNSLog:jSonObject[key] withIndetation:[[NSString alloc] initWithFormat:@"%@   ", indent]];
		}
	else if ([jSonObject isKindOfClass:[NSArray class]])
		for (int i = 0; i < [jSonObject count]; i++) {
			Log4ObjC(@"%@Array: %d", indent, i);
			[self foundationObjectsToNSLog:jSonObject[i] withIndetation:[[NSString alloc] initWithFormat:@"%@   ", indent]];
  }
	else
		Log4ObjC(@"%@Value: %@", indent, jSonObject);
}

@end
