#import <XCTest/XCTest.h>

#import "MockScav.h"
#import "MockScavItem.h"
#import "MockScavsDownload.h"
#import "GetScavItemsRequestOperation.h"
#import "OCMockObject.h"
#import "OCMArg.h"
#import "OCMockRecorder.h"

@interface GetScavItemsRequestOperationTests : XCTestCase
{
  MockScav* _mockScav;
  GetScavItemsRequestOperation* _operationForGetScavItemsRequest;
  id _operationForGetScavItemsRequestOperationPartialMock;
  id _actualJsonReturned;
  NSDictionary* _expectedJsonDictionary;
  BOOL _finishedWithSuccessStatusAndJSONResponseWasCalled;
}

- (void)respondWithSuccessStatusCodeCalledWithArg:(id)jsonArg;

@end

@implementation GetScavItemsRequestOperationTests

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

- (void)testShouldReturnScavItemsForSelectedScavToJavascriptAsJSON
{
  [self givenSelectedScav];
  [self whenINavigateIntoTheScavItemsView];
  [self thenScavItemsAreSentToJavascriptAsJson];
}

- (void)givenSelectedScav
{
  _mockScav = [self buildMockScavForTest];
  _expectedJsonDictionary = [self retrieveExpectedJsonDictionary];

  _operationForGetScavItemsRequest = [[GetScavItemsRequestOperation alloc] init];
  _operationForGetScavItemsRequestOperationPartialMock = (GetScavItemsRequestOperation *)[OCMockObject partialMockForObject:_operationForGetScavItemsRequest];

  [[[_operationForGetScavItemsRequestOperationPartialMock stub]
      andCall:@selector(respondWithSuccessStatusCodeCalledWithArg:) onObject:self]
                   finishedWithSuccessStatusAndJSONResponseObject:[OCMArg any]];

  _finishedWithSuccessStatusAndJSONResponseWasCalled = NO;
}

- (void)whenINavigateIntoTheScavItemsView
{
  [(GetScavItemsRequestOperation *)_operationForGetScavItemsRequestOperationPartialMock convertScavsToJsonAndRespond:(id)_mockScav];
}

- (void)thenScavItemsAreSentToJavascriptAsJson
{
  XCTAssertEqualObjects(_expectedJsonDictionary[@"_id"], (NSDictionary *)_actualJsonReturned[@"_id"], @"Scav ids don't match");
  XCTAssertEqualObjects(_expectedJsonDictionary[@"name"], (NSDictionary *)_actualJsonReturned[@"name"], @"Scav names don't match");
  XCTAssertEqualObjects(_expectedJsonDictionary[@"status"], (NSDictionary *)_actualJsonReturned[@"status"], @"Scav names don't match");

  XCTAssertEqualObjects(_expectedJsonDictionary[@"thumbnail"], (NSDictionary *)_actualJsonReturned[@"thumbnail"], @"Scav descriptions don't match");
  XCTAssertEqualObjects(_expectedJsonDictionary[@"thumbnailType"], (NSDictionary *)_actualJsonReturned[@"thumbnailType"], @"Scav descriptions don't match");


  NSPredicate* scavItemOneFilter = [NSPredicate predicateWithFormat:@"id == %@", @"111"];
  NSPredicate* scavItemTwoFilter = [NSPredicate predicateWithFormat:@"id == %@", @"222"];

  NSDictionary* expectedScavItemOne = [[_expectedJsonDictionary[@"scavItems"] filteredArrayUsingPredicate:scavItemOneFilter] firstObject];
  NSDictionary* actualScavItemOne = [[_actualJsonReturned[@"scavItems"] filteredArrayUsingPredicate:scavItemOneFilter] firstObject];

  NSDictionary* expectedScavItemTwo = [[_expectedJsonDictionary[@"scavItems"] filteredArrayUsingPredicate:scavItemTwoFilter] firstObject];
  NSDictionary* actualScavItemTwo = [[_actualJsonReturned[@"scavItems"] filteredArrayUsingPredicate:scavItemTwoFilter] firstObject];

  XCTAssertEqualObjects(expectedScavItemOne, actualScavItemOne, @"First scav items aren't equal");
  XCTAssertEqualObjects(expectedScavItemTwo, actualScavItemTwo, @"Second scav items aren't equal");
}

// Helpers
- (void)respondWithSuccessStatusCodeCalledWithArg:(id)jsonArg
{
  _finishedWithSuccessStatusAndJSONResponseWasCalled = YES;
  _actualJsonReturned = jsonArg;
}

- (NSDictionary *)retrieveExpectedJsonDictionary
{
  return @{
      @"_id" : @"1234567",
      @"scavItems" : @[
          @{
              @"coordinates" : @{ @"latitude" : @"41.40338", @"longitude" : @"2.17403" },
              @"hint" : @"hint for scav item one",
              @"level" : @"beginner",
              @"_id" : @"111",
              @"thumbnail" : @"ScavItemOneImage",
              @"thumbnailType" : @"PNG",
              @"name" : @"scav item one",
              @"pointColor" : @"black",
              @"pointValue" : @"5",
              @"status" : @"ACTIVE"
          },
          @{
              @"coordinates" : @{ @"latitude" : @"31.12345", @"longitude" : @"1.54321" },
              @"hint" : @"hint for scav item two",
              @"level" : @"beginner",
              @"_id" : @"222",
              @"thumbnail" : @"ScavItemTwoImage",
              @"thumbnailType" : @"PNG",
              @"name" : @"scav item two",
              @"pointColor" : @"green",
              @"pointValue" : @"7",
              @"status" : @"ACTIVE"
           }
      ],
      @"name" : @"Test Scav",
      @"status" : @"INPROGRESS"
  };
}

- (MockScav *)buildMockScavForTest
{
  MockScav* mockScav = [[MockScav alloc] init];

  MockScavsDownload* mockScavsDownload = [[MockScavsDownload alloc] init];

  MockScavItem* mockScavItemOne = [[MockScavItem alloc] init];
  MockScavItem* mockScavItemTwo = [[MockScavItem alloc] init];

  mockScavItemOne.scavItemId = @"111";
  mockScavItemOne.hint = @"hint for scav item one";
  mockScavItemOne.thumbnail = @"ScavItemOneImage";
  mockScavItemOne.thumbnailType = @"PNG";
  mockScavItemOne.name = @"scav item one";
  mockScavItemOne.pointColor = @"black";
  mockScavItemOne.pointValue = @5;
  mockScavItemOne.coordinates = (NSMutableDictionary *)@{@"latitude" : @"41.40338", @"longitude" : @"2.17403"};
  mockScavItemOne.status = @"ACTIVE";
  mockScavItemOne.scavParent = _mockScav;

  mockScavItemTwo.scavItemId = @"222";
  mockScavItemTwo.hint = @"hint for scav item two";
  mockScavItemTwo.thumbnail = @"ScavItemTwoImage";
  mockScavItemTwo.thumbnailType = @"PNG";
  mockScavItemTwo.name = @"scav item two";
  mockScavItemTwo.pointColor = @"green";
  mockScavItemTwo.pointValue = @7;
  mockScavItemTwo.coordinates = (NSMutableDictionary *)@{@"latitude" : @"31.12345", @"longitude" : @"1.54321"};
  mockScavItemTwo.status = @"ACTIVE";
  mockScavItemTwo.scavParent = _mockScav;

  mockScav.scavId = @"1234567";
  mockScav.image = @"ScavImage";
  mockScav.imageType = @"PNG";
  mockScav.level = @"beginner";
  mockScav.name = @"Test Scav";
  mockScav.duration = @"04:30:00";
  mockScav.thumbnail = @"TestScavThumbnailImage";
  mockScav.thumbnailType = @"PNG";
  mockScav.scavDescription = @"Test scav description";
  mockScav.scavMongoId = @"7564321";
  mockScav.status = @"INPROGRESS";
  mockScav.scavsDownloadParent = mockScavsDownload;
  mockScav.scavItems = [[NSSet alloc] initWithObjects:mockScavItemOne, mockScavItemTwo, nil];

  return mockScav;
}

@end