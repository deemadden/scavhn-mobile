//
// Created by Dee Madden on 2/7/14.
// Copyright (c) 2014 SoftSource. All rights reserved.
//

#import "ScavItemNativeVerifyRequestOperation.h"
#import "JSONHelper.h"
#import "CameraViewController.h"
#import "UIViewController+UIStoryboard.h"
#import "UIApplication+Scavhn.h"
#import "WebServicesManager.h"

@interface ScavItemNativeVerifyRequestOperation() <CameraViewDelegate>

@property(nonatomic, strong) UIImagePickerController* pickerController;
@property(nonatomic, strong) CameraViewController* cameraViewController;
@property(nonatomic, strong) ScavhnViewController *scavhnViewController;
@property(nonatomic, strong) NSDictionary* scavItemInfo;
@property(nonatomic, strong) NSDictionary *locationManagerCurrentPosition;
@property(nonatomic, strong) NSError* scavItemWebServicePutError;

@end

@implementation ScavItemNativeVerifyRequestOperation

- (void)start
{
  if (![self startingExecution])
    return;

  NSError* error = nil;

  // Figure out which Scav the Player Picked
  NSString* decodedUrl = [self.request.URL.path stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
  NSRegularExpression* regex = [NSRegularExpression regularExpressionWithPattern:@".*users/([a-zA-Z-_]+)/scavs/([a-zA-Z0-9-_]+)/items/([a-zA-Z0-9-_]+)"
                                                                         options:NSRegularExpressionCaseInsensitive error:&error];

  NSString* playerName = [regex stringByReplacingMatchesInString:decodedUrl options:0 range:NSMakeRange(0, [decodedUrl length]) withTemplate:@"$1"];
  NSString* scavId = [regex stringByReplacingMatchesInString:decodedUrl options:0 range:NSMakeRange(0, [decodedUrl length]) withTemplate:@"$2"];
  NSString* scavItemId = [regex stringByReplacingMatchesInString:decodedUrl options:0 range:NSMakeRange(0, [decodedUrl length]) withTemplate:@"$3"];

  // Get the changes from the HTTP request body
  NSString* requestBodyJSONString = [[NSString alloc] initWithBytes:self.request.HTTPBody.bytes length:self.request.HTTPBody.length encoding:NSUTF8StringEncoding];
  NSDictionary* requestBodyJSONDict = [JSONHelper decodeJSON:requestBodyJSONString];

  NSString* scavItemName = requestBodyJSONDict[@"scavItemName"];
  NSString* scavItemThumbnail = requestBodyJSONDict[@"thumbnail"];
  NSString* scavItemThumbnailType = requestBodyJSONDict[@"thumbnailType"];
  UIImage* scavItemThumbnailImage = [self locateScavItemImageWithThumbnail:scavItemThumbnail andThumbnailType:scavItemThumbnailType];

  self.scavItemInfo = @{
      @"playerName": playerName,
      @"scavId": scavId,
      @"scavItemId": scavItemId,
      @"scavItemName": scavItemName,
      @"scavItemThumbnail": scavItemThumbnail,
      @"scavItemThumbnailType": scavItemThumbnailType,
      @"scavItemThumbnailImage": scavItemThumbnailImage
  };

  // Check the OS version to make sure it supports what we're going to use
  [self checkDeviceCameraSupport];

  // Pop the ImagePicker. Give it the data it needs.
  dispatch_async(dispatch_get_main_queue(),^ {
    [self displayCameraDialogAsType:UIImagePickerControllerSourceTypeCamera];
  });
}

- (void)checkDeviceCameraSupport
{
  if (![UIImagePickerController isSourceTypeAvailable:UIImagePickerControllerSourceTypeCamera])
  {
    UIAlertView* myAlertView = [[UIAlertView alloc] initWithTitle:@"Error"
                                                          message:@"Device has no camera"
                                                         delegate:nil
                                                cancelButtonTitle:@"OK"
                                                otherButtonTitles: nil];

    [myAlertView show];
  }
}

- (void)displayCameraDialogAsType:(UIImagePickerControllerSourceType)sourceType
{
  // grab the main nav controller to display workspace dialog in
  self.scavhnViewController = [[UIApplication sharedApplication] scavhnViewController];

  // Start looking for the current coordinates
  [self.scavhnViewController startLocationServices];

  self.pickerController = [[UIImagePickerController alloc] init];
  self.pickerController.delegate = self;
  self.pickerController.allowsEditing = YES;
  self.pickerController.sourceType = sourceType;
  self.pickerController.showsCameraControls = NO;

  self.cameraViewController = [CameraViewController viewControllerInStoryboardNamed:@"CameraView"];
  self.cameraViewController.delegate = self;

  self.pickerController.cameraOverlayView = self.cameraViewController.view;

  [self.scavhnViewController presentViewController:self.pickerController animated:YES completion:nil];
}

- (UIImage *)locateScavItemImageWithThumbnail:(NSString *)thumbnail andThumbnailType:(NSString *)thumbnailType
{
  NSString* path = [[NSBundle mainBundle]
                        pathForResource:[NSString stringWithFormat:@"web/resources/img/scavitemsscreen/itemstofind/%@-sm", thumbnail]
                                 ofType:[thumbnailType lowercaseString]];

  UIImage* scavItemImage = [[UIImage alloc] initWithContentsOfFile:path];

  return scavItemImage ?: nil;
}

#pragma UIImagePickerControllerDelegates
- (void)imagePickerController:(UIImagePickerController *)picker didFinishPickingMediaWithInfo:(NSDictionary *)info
{
  self.locationManagerCurrentPosition = [self.scavhnViewController retrieveCurrentPositionFromLocationServices];

  // Cross fade the retake picture view in
  [self.cameraViewController showRetakeViewWithPicture:info];
}

- (void)imagePickerControllerDidCancel:(UIImagePickerController *)picker
{
  [picker dismissViewControllerAnimated:YES completion:^{
    [self finishedWithSuccessStatusAndJSONResponseObject:@{ @"userCancelledDialog" : @"true" }];
  }];
}

#pragma CameraViewControllerDelegates
- (void)cameraViewDidLoad:(CameraViewController *)cameraViewController
{
  [cameraViewController setHeaderInfo:self.scavItemInfo];
}

- (void)cameraViewWillTakePicture:(CameraViewController *)cameraViewController
{
  [self.pickerController takePicture];
}

- (void)cameraViewWillDismissPicker:(CameraViewController *)cameraViewController
      withPictureOfScavItemAsString:(NSString *)base64Image
                userCancelledDialog:(BOOL)didUserCancel
{
  [self.scavhnViewController stopLocationServices];

  [self.pickerController dismissViewControllerAnimated:YES completion:^{

    if(didUserCancel)
      [self finishedWithSuccessStatusAndJSONResponseObject:@{ @"userCancelledDialog" : @"true" }];
    else if (!self.scavItemWebServicePutError)
      [self finishedWithSuccessStatusAndJSONResponseObject:@{ @"userCancelledDialog" : @"false", @"scavItemFoundImage" : base64Image }];
    else
      [self finishedExecutionWithStatus:700 andJSONResponseObject:@{ @"userCancelledDialog" : @"false", @"scavItemFoundImage" : base64Image }];
  }];
}

- (void)cameraViewWillConfirmAndSavePicture:(CameraViewController *)cameraViewController
{
  // Stop the geolocation services
  [self.scavhnViewController stopLocationServices];

  // Do the PUT call
  NSDictionary* scavItemUpdateInfo = @{
      @"playerName" : self.scavItemInfo[@"playerName"],
      @"scavId" : self.scavItemInfo[@"scavId"],
      @"scavItemId" : self.scavItemInfo[@"scavItemId"],
      @"scavItemName" : self.scavItemInfo[@"scavItemName"],
      @"heading" : self.locationManagerCurrentPosition[@"heading"],
      @"coordinates" : @{ @"latitude" : self.locationManagerCurrentPosition[@"latitude"], @"longitude" : self.locationManagerCurrentPosition[@"longitude"] },
      @"altitude" : self.locationManagerCurrentPosition[@"altitude"],
      @"altitudeAccuracy" : self.locationManagerCurrentPosition[@"verticalAccuracy"],
      @"accuracy" : self.locationManagerCurrentPosition[@"horizontalAccuracy"]
  };

  __weak typeof(self) weakSelf = self;

  // Check against Scav Item (PUT Call here)
  NSURLSessionTask* downloadTask = [WebServicesManager updateScavItemWithInfo:scavItemUpdateInfo withCompletionBlock:^(id json, NSError* error)
  {
      // Save to Camera Roll
      weakSelf.scavItemWebServicePutError = error;
      [cameraViewController savePicture];

  }];

  Log4ObjC(@"Scav Item PUT Request task %@", downloadTask.originalRequest);
}

@end