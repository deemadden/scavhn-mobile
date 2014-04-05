//
//  JSONHelper.h
//
//
//

#import <Foundation/Foundation.h>

@interface JSONHelper : NSObject

+ (NSString *)encodeJSON:(id)jsonObject;
+ (NSString *)encodeJSON:(id)jsonObject asCompactAndSerialized:(BOOL)shouldNotBePretty;
+ (BOOL)encodeJSON:(id)jsonObject toFile:(NSString*)filePath;

+ (id)decodeJSON:(NSString*)jsonString;
+ (id)decodeJSONFromFile:(NSString*)filePath;

+ (void)foundationObjectsToNSLog:(id)jSonObject withIndetation:(NSString *)indent;

@end
