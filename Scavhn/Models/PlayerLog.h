//
//  PlayerLog.h
//  Scavhn
//
//  Created by Dee Madden on 1/31/14.
//  Copyright (c) 2014 SoftSource. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreData/CoreData.h>

@class Player;

@interface PlayerLog : NSManagedObject

@property (nonatomic, retain) NSString * scavName;
@property (nonatomic, retain) NSString * startTime;
@property (nonatomic, retain) Player *playerParent;

@end
