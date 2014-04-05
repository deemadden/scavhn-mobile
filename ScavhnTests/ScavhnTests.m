//
//  ScavhnTests.m
//  ScavhnTests
//
//
//  Copyright (c) 2013 SoftSource. All rights reserved.
//

#import <XCTest/XCTest.h>

@interface ScavhnTests : XCTestCase

@end

@implementation ScavhnTests

- (void)setUp
{
    [super setUp];
    // Put setup code here. This method is called before the invocation of each test method in the class.
}

- (void)tearDown
{
    // Put teardown code here. This method is called after the invocation of each test method in the class.
    [super tearDown];
}

- (void)skipTestExample
{
    XCTFail(@"No implementation for \"%s\"", __PRETTY_FUNCTION__);
}

@end
