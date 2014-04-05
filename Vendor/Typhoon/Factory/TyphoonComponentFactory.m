////////////////////////////////////////////////////////////////////////////////
//
//  TYPHOON FRAMEWORK
//  Copyright 2013, Jasper Blues & Contributors
//  All Rights Reserved.
//
//  NOTICE: The authors permit you to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
//
////////////////////////////////////////////////////////////////////////////////


#import <objc/runtime.h>
#import <objc/message.h>
#import "TyphoonComponentFactory.h"
#import "TyphoonDefinition.h"
#import "TyphoonComponentFactory+InstanceBuilder.h"
#import "TyphoonKeyedStackInstanceRegister.h"

@interface TyphoonDefinition (TyphoonComponentFactory)

@property(nonatomic, strong) NSString* key;

@end

@implementation TyphoonComponentFactory

static TyphoonComponentFactory* defaultFactory;


/* ====================================================================================================================================== */
#pragma mark - Class Methods

+ (id)defaultFactory
{
    return defaultFactory;
}

/* ====================================================================================================================================== */
#pragma mark - Initialization & Destruction

- (id)init
{
    self = [super init];
    if (self)
    {
        _registry = [[NSMutableArray alloc] init];
        _singletons = [[NSMutableDictionary alloc] init];
        _currentlyResolvingReferences = [TyphoonKeyedStackInstanceRegister instanceRegister];
        _postProcessors = [[NSMutableArray alloc] init];
      
    }
    return self;
}


/* ====================================================================================================================================== */
#pragma mark - Interface Methods

- (NSArray*)singletons
{
    return [_singletons copy];
}

- (void)load
{
    @synchronized (self)
    {
        if (!_isLoading && ![self isLoaded])
        {
            // ensure that the method won't be call recursively.
            _isLoading = YES;
          
            [self applyComponentFactoryLoadPostProcessing];

            _isLoading = NO;
            [self setLoaded:YES];
        }
    }
}

- (void)unload
{
    @synchronized (self)
    {
        if ([self isLoaded])
        {
            [_singletons removeAllObjects];
            [self setLoaded:NO];
        }
    }
}

- (void)register:(TyphoonDefinition*)definition
{
    if ([definition.key length] == 0)
    {
        NSString* uuidStr = [[NSProcessInfo processInfo] globallyUniqueString];
        definition.key = [NSString stringWithFormat:@"%@_%@", NSStringFromClass(definition.type), uuidStr];
    }
    if ([self definitionForKey:definition.key])
    {
        [NSException raise:NSInvalidArgumentException format:@"Key '%@' is already registered.", definition.key];
    }
    if ([definition.type respondsToSelector:@selector(typhoonAutoInjectedProperties)])
    {
        for (NSString* autoWired in objc_msgSend(definition.type, @selector(typhoonAutoInjectedProperties)))
        {
            [definition injectProperty:NSSelectorFromString(autoWired)];
        }
    }
    
    if ([self infrastructureComponentProcessedFromDefinition:definition])
    {
      Log4ObjC(@"Registering Infrastructure component: %@ with key: %@", NSStringFromClass(definition.type), definition.key);
    }
    else
    {
      Log4ObjC(@"Registering: %@ with key: %@", NSStringFromClass(definition.type), definition.key);
      [_registry addObject:definition];
    }
    
    // I would handle it via an exception but, in order to keep
    // the contract of the class, I have implemented another
    // strategy: since the not-lazy singletons have to be built once
    // the factory has been loaded, we build it directly in
    // the register method if the factory is already loaded.
    if ([self isLoaded])
    {
        [self applyComponentFactoryLoadPostProcessing];
    }
}

- (id)componentForType:(id)classOrProtocol
{
    if (![self isLoaded])
    {[self load];}
    return [self objectForDefinition:[self definitionForType:classOrProtocol]];
}

- (NSArray*)allComponentsForType:(id)classOrProtocol
{
    if (![self isLoaded])
    {[self load];}
    NSMutableArray* results = [[NSMutableArray alloc] init];
    NSArray* definitions = [self allDefinitionsForType:classOrProtocol];
    for (TyphoonDefinition* definition in definitions)
    {
        [results addObject:[self objectForDefinition:definition]];
    }
    return [results copy];
}


- (id)componentForKey:(NSString*)key
{
    if (!key)
    {
            return nil;
    }

    if ([self notLoaded])
    {[self load];}
    TyphoonDefinition* definition = [self definitionForKey:key];
    if (!definition)
    {
        [NSException raise:NSInvalidArgumentException format:@"No component matching id '%@'.", key];
    }
    return [self objectForDefinition:definition];
}

- (BOOL)notLoaded;
{
    return ![self isLoaded];
}

- (void)makeDefault
{
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^
    {
        defaultFactory = self;
    });
}

- (NSArray*)registry
{
    if (![self isLoaded])
    {[self load];}
    return [_registry copy];
}

- (void)attachPostProcessor:(id<TyphoonComponentFactoryPostProcessor>)postProcessor
{
    Log4ObjC(@"Attaching post processor: %@", postProcessor);
    [_postProcessors addObject:postProcessor];
}

- (void)injectProperties:(id)instance
{
    Class class = [instance class];
    for (TyphoonDefinition* definition in _registry)
    {
        if (definition.type == class)
        {
            [self injectPropertyDependenciesOn:instance withDefinition:definition];
        }
    }
}

/* ====================================================================================================================================== */
#pragma mark - Utility Methods

- (NSString*)description
{
    NSMutableString* description = [NSMutableString stringWithFormat:@"<%@: ", NSStringFromClass([self class])];
    [description appendFormat:@"_registry=%@", _registry];
    [description appendString:@">"];
    return description;
}


/* ====================================================================================================================================== */
#pragma mark - Private Methods

- (BOOL)infrastructureComponentProcessedFromDefinition:(TyphoonDefinition *)definition
{
    if ([definition.type conformsToProtocol:@protocol(TyphoonComponentFactoryPostProcessor)])
    {
        [self attachPostProcessor:[self objectForDefinition:definition]];
        return YES;
    }
    return NO;
}

- (void)applyComponentFactoryLoadPostProcessing {
  
  // Apply the factory post processors.
  [_postProcessors enumerateObjectsUsingBlock:^(id <TyphoonComponentFactoryPostProcessor> postProcessor, NSUInteger idx, BOOL* stop)
   {
     [postProcessor postProcessComponentFactory:self];
   }];
  
  // Then, we instanciate the not-lazy singletons.
  [_registry enumerateObjectsUsingBlock:^(id definition, NSUInteger idx, BOOL* stop)
   {
     if (([definition scope] == TyphoonScopeSingleton) && ![definition isLazy])
     {
       [self singletonForDefinition:definition];
     }
     
   }];
}

- (id)objectForDefinition:(TyphoonDefinition*)definition
{
    if (definition.scope == TyphoonScopeSingleton)
    {
        return [self singletonForDefinition:definition];
    }

    return [self buildInstanceWithDefinition:definition];
}

- (id)singletonForDefinition:(TyphoonDefinition*)definition
{
    @synchronized (self)
    {
        id instance = [_singletons objectForKey:definition.key];
        if (instance == nil)
        {
            instance = [self buildSingletonWithDefinition:definition];
            [_singletons setObject:instance forKey:definition.key];
        }
        return instance;
    }
}

- (TyphoonDefinition*)definitionForKey:(NSString*)key
{
    for (TyphoonDefinition* definition in _registry)
    {
        if ([definition.key isEqualToString:key])
        {
            return definition;
        }
    }
    return nil;
}

@end