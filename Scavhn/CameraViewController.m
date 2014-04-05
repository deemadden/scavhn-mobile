//
//  CameraViewController.m
//  CameraApp
//
//  Created by Dee Madden on 2/5/14.
//  Copyright (c) 2014 Dee Madden. All rights reserved.
//

#import "CameraViewController.h"
#import "Base64.h"

@interface CameraViewController ()

@property (nonatomic, weak) IBOutlet UIView* headerView;
@property (nonatomic, weak) IBOutlet UIImageView* scavItemImage;
@property (nonatomic, weak) IBOutlet UILabel* scavItemLabel;
@property (nonatomic, weak) IBOutlet UIView* takePictureView;
@property (nonatomic, weak) IBOutlet UIButton* takePictureButton;
@property (nonatomic, weak) IBOutlet UIButton* cancelButton;
@property (nonatomic, weak) IBOutlet UIView* retakePictureView;
@property (nonatomic, weak) IBOutlet UIButton* retakePictureButton;
@property (nonatomic, weak) IBOutlet UIButton* confirmButton;

-(IBAction)takePictureButtonTapped:(UIButton*)sender;
-(IBAction)cancelButtonTapped:(UIButton*)sender;
-(IBAction)retakePictureButtonTapped:(UIButton*)sender;
-(IBAction)confirmButtonTapped:(UIButton*)sender;

@end

@implementation CameraViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
	  // Do any additional setup after loading the view.
    [self.delegate cameraViewDidLoad:self];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (IBAction)takePictureButtonTapped:(UIButton *)sender
{
  [self.delegate cameraViewWillTakePicture:self];
}

- (IBAction)cancelButtonTapped:(UIButton *)sender
{
  [self.delegate cameraViewWillDismissPicker:self withPictureOfScavItemAsString:nil userCancelledDialog:YES ];
}

- (IBAction)retakePictureButtonTapped:(UIButton *)sender
{
  // Crossfade back to the Take Picture View
  self.picturePreview.hidden = YES;
  self.takePictureView.hidden = NO;

  [UIView animateWithDuration:0.3
                        delay:0
                      options:UIViewAnimationOptionCurveEaseInOut
                   animations:^
                   {
                     self.retakePictureView.alpha = 0.0;
                     self.takePictureView.alpha = 1.0;
                   }
                   completion:(void (^)(BOOL))^
                   {
                     self.retakePictureView.hidden = YES;
                     return YES;
                   }];
}

- (IBAction)confirmButtonTapped:(UIButton *)sender
{
  [self.delegate cameraViewWillConfirmAndSavePicture:self];
}

- (void)showRetakeViewWithPicture:(NSDictionary *)mediaInfo {
  self.picturePreview.image = mediaInfo[UIImagePickerControllerOriginalImage];
  self.picturePreview.hidden = NO;

  // Display the retake subview
  self.retakePictureView.hidden = NO;

  [UIView animateWithDuration:0.3
                        delay:0
                      options:UIViewAnimationOptionCurveEaseInOut
                   animations:^
                   {
                     self.takePictureView.alpha = 0.0;
                     self.retakePictureView.alpha = 1.0;
                   }
                   completion:(void (^)(BOOL))^
                   {
                     self.takePictureView.hidden = YES;
                     return YES;
                   }];
}

- (void)savePicture
{
  UIImageWriteToSavedPhotosAlbum(self.picturePreview.image, self, @selector(pickedImageSaved:finishedWithError:contextInfo:), nil);
}

- (void)pickedImageSaved:(UIImage *)pickedImage finishedWithError:(NSError *)error contextInfo:(void *)contextInfo
{
  if(error)
  {
    UIAlertView* alert = [[UIAlertView alloc] initWithTitle:@"Save failed"
                                                    message:@"Failed to save image"
                                                   delegate:nil
                                          cancelButtonTitle:@"OK"
                                          otherButtonTitles:nil];

    [alert show];
  }

  // Get a base64 version of the image to send back to the view
  NSString* base64EncodedImage = [Base64 encode:UIImageJPEGRepresentation(self.picturePreview.image, 0.8)];

  [self.delegate cameraViewWillDismissPicker:self
               withPictureOfScavItemAsString:base64EncodedImage
                         userCancelledDialog:NO];
}

- (void)setHeaderInfo:(NSDictionary *)scavItemInfo
{
  self.scavItemImage.image = scavItemInfo[@"scavItemThumbnailImage"];
  self.scavItemLabel.text = scavItemInfo[@"scavItemName"];
  [self.scavItemLabel sizeToFit];
}

@end
