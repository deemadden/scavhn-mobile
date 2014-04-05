//
//  UIWebView+Shadows.m
//
//
//
//

#import "UIWebView+Shadows.h"

@implementation UIWebView (Shadows)

- (void)setShadowImagesHidden:(BOOL)hidden
{
  // Remove the shadow images at the top and bottom of the webview when scrolling
	// Modified from
	// http://stackoverflow.com/questions/2238914/how-to-remove-grey-shadow-on-the-top-uiwebview-when-overscroll/2323885#2323885
  for (UIView *subview in self.scrollView.subviews)
  {
		if ([subview isKindOfClass:[UIImageView class]])
			subview.hidden = hidden;
	}
}

@end
