//
//  NSArray+Functional.h
//
//
//  Copyright (c) 2013 Agustín de Cabrera. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface NSArray (Functional)

/*! 
 Calls block once for each element in self, passing that element as a parameter.
 */
- (void)each:(void (^)(id obj))block;

/*! 
 Invokes block once for each element of self, returning a new array containing the
 values returned by the block.
 */
- (NSArray *)map:(id (^)(id obj))block;

/*!
 Invokes block once for each element of self, returning a new array containing the
 values returned by the block.
 */
- (NSArray *)mapIndexes:(id (^)(id obj, NSUInteger idx))block;

/*! 
 Invokes block once for each element of self, returning an array containing those
 elements for which the block returns a true value.
 */
- (NSArray *)select:(BOOL (^)(id obj))block;

/*! 
 Returns the first object in self for which block is true. Returns nil if no match is found.
 */
- (id)match:(BOOL (^)(id obj))block;

/*! 
 Combines all objects of self by applying a binary operation, specified by a block.
 For each object in self the block is passed an accumulator value (accum) and the object.
 The result becomes the new value for 'accumulator'. At the end of the iteration, the final
 value of 'accumulator' is the return value for the method. The initial value of 'accumulator'
 will be the 'initial' parameter.
 */
- (id)reduce:(id)initial block:(id (^)(id accumulator, id obj))block;

/*! 
 Returns YES if the block is true for all objects in self.
 */
- (BOOL)all:(BOOL (^)(id obj))block;

/*! 
 Returns YES if the block is true for any object in self.
 */
- (BOOL)any:(BOOL (^)(id obj))block;

/*! 
 Calls the block once for each pair of elements, one from each array.
 If one array has more elements than the other the method will ignore those extra elements.
 */
- (void)with:(NSArray*)array each:(void (^)(id obj1, id obj2))block;

/*!
 Calls the block once for each pair of elements, one from each array, returning a new
 array containing the values returned by the block.
 If one array has more elements than the other the method will ignore those extra elements.
 */
- (NSArray*)mapWith:(NSArray*)array each:(id (^)(id obj1, id obj2))block;

/*!
 Invokes block once for each element of self, returning a dictionary with these elements 
 as values and the results of the block invocations as keys.
 */
- (NSDictionary*)mapToDictionary:(id<NSCopying> (^)(id obj))block;

/*!
 Invokes block once for each element of self, passing an index and returning a dictionary with these elements
 as values and the results of the block invocations as keys.
 */
- (NSDictionary*)mapToDictionaryWithIndexes:(id<NSCopying> (^)(id obj, NSUInteger index))block;

/*!
 Invokes block once for each element of self, creates arrays with all objects that return the same value.
 Returns a dictionary with the arrays as values and the results of the block invocations as keys.
 */
- (NSDictionary*)groupBy:(id<NSCopying> (^)(id obj))block;

/*!
 Invokes block once for each element of self, returning a new array containing the
 values returned by the block. The options parameter can be used to modify the enumeration behavior.
 */
- (NSArray *)mapWithOptions:(NSEnumerationOptions)options usingBlock:(id (^)(id obj, NSUInteger idx))block;

@end

@interface NSMutableArray (Functional)

/*! Invokes block once for each element of self, returning a new array containing the
 values returned by the block.
 */
- (NSMutableArray*)map:(id (^)(id obj))block;

/*! Invokes block once for each element of self, returning an array containing those
 elements for which the block returns a true value.
 */
- (NSMutableArray*)select:(BOOL (^)(id obj))block;

@end
