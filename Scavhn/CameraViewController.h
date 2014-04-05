//
//  CameraViewController.h
//  CameraApp
//
//  Created by Dee Madden on 2/5/14.
//  Copyright (c) 2014 Dee Madden. All rights reserved.
//

#import <UIKit/UIKit.h>

@protocol CameraViewDelegate;

@interface CameraViewController : UIViewController

@property (nonatomic, weak) id<CameraViewDelegate> delegate;
@property (nonatomic, weak) IBOutlet UIImageView* picturePreview;

- (void)showRetakeViewWithPicture:(NSDictionary *)mediaInfo;
- (void)savePicture;

- (void)setHeaderInfo:(NSDictionary *)scavItemInfo;
@end


@protocol CameraViewDelegate <NSObject>

- (void)cameraViewWillTakePicture:(CameraViewController *)cameraViewController;

- (void)cameraViewWillDismissPicker:(CameraViewController *)cameraViewController withPictureOfScavItemAsString:(NSString *)base64Image userCancelledDialog:(BOOL)didUserCancel;
- (void)cameraViewWillConfirmAndSavePicture:(CameraViewController *)cameraViewController;
- (void)cameraViewDidLoad:(CameraViewController *)cameraViewController;

@end