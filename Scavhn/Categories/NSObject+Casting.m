//
//  NSObject+Casting.m
//
//
//  Copyright (c) 2013 Agustín de Cabrera. All rights reserved.
//

#import "NSObject+Casting.h"

@implementation NSObject (Casting)

- (id)asObjectOfClass:(Class)aClass
{
    return [self isKindOfClass:aClass] ? self : nil;
}

@end
