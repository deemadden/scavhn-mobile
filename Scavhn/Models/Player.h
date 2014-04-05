//
//  Player.h
//  Scavhn
//
//  Created by Dee Madden on 1/31/14.
//  Copyright (c) 2014 SoftSource. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreData/CoreData.h>

@class PlayerLog;

@interface Player : NSManagedObject

@property (nonatomic, retain) NSString * name;
@property (nonatomic, retain) NSSet *playerLogs;
@end

@interface Player (CoreDataGeneratedAccessors)

- (void)addPlayerLogsObject:(PlayerLog *)value;
- (void)removePlayerLogsObject:(PlayerLog *)value;
- (void)addPlayerLogs:(NSSet *)values;
- (void)removePlayerLogs:(NSSet *)values;

@end
