/**
 * Created by deemadden on 9/10/13.
 */
define(

  'App',

  [ 'utils/Debug' ],

  function(Debug)
  {
    /**
     *  App
     *  Main application model
     *  Handles loading pages as well as references to other pages
     *
     *  [Events]
     *  dep:loaded(dep_id) - when a call to App.getInstance().loadDep('foo/bar/Baz') has completed
     */
    var App = Backbone.Model.extend({

        defaults: {
          view: null,
          ServicesAdapter: null,
          iOSRouteMediatorBridge: null
        },

        // Store a hash of all loaded dependencies
        deps: { },

        // View root selector
        view_root: '.view-root',

        /**
         *  @private
         */
        constructor: function(lock)
        {
          if (!lock || lock != App.lock)
            throw new Error('Use App.getInstance() instead');

          //noinspection JSUnresolvedVariable
          Backbone.Model.prototype.constructor.apply(this, []);
        },

        /**
         *  initialize
         *  Main entry point, instantiate some routers and things
         */
        initialize: function()
        {
          // Load the core dependencies
          this.loadCoreDeps();
        },

        /**
         *  loadCoreDeps
         *  Load core dependencies that App requires.
         *  The reason we can't load them normally is that they have a dependency on App as well,
         *  so App needs to be defined before they can access them as a regular define() dependency
         */
        loadCoreDeps: function()
        {
          require(

            [ 'services/ServicesAdapter',
              'mediator/RouteMediator',
              'mediator/IOSRouteMediatorBridge' ],

            _.bind(this.coreDepsLoaded, this)
          );
        },

        loadAppView: function() {
          require(

            [ 'views/AppView',
              'viewmodels/AppViewModel' ],

            _.bind(this.appViewDepsLoaded, this)
          );
        },

        /**
         *  coreDepsLoaded
         *  Called when core dependencies have been loaded
         *  Params are whatever was passed in the array in loadCoreDeps, above
         */
        coreDepsLoaded: function(ServicesAdapter, RouteMediator, IOSRouteMediatorBridge)
        {
          this.set('ServicesAdapter', ServicesAdapter);
          this.routeMediator = RouteMediator;
          this.set('iOSRouteMediatorBridge', IOSRouteMediatorBridge);

          this.loadAppView();
        },

        appViewDepsLoaded: function (AppView, AppViewModel) {
        	$.support.cors = true;
          // create base view -> viewModel
          var appViewModel = new AppViewModel();
          this.set('view', new AppView({ el: $(this.view_root), viewmodel: appViewModel }));

          appViewModel.set('view', this.get('view'));
          appViewModel.activate();

          // Check iOS version. We need to add some extra styling for iOS7 to some views.
          if(navigator.userAgent.indexOf('iPhone OS 7_0') !== -1)
            this.get('ServicesAdapter').set('isDeviceRunningIOS7', true);

          // create all the routes
          this.routeMediator.createRoutes();

          // now navigate in.
          this.routeMediator.navigateTo('homeScreen', {});

          appViewModel.showLoadIndicator();
        },

        /**
         *  getBuildRoute
         *  Convenience method for RouteMediator.buildRoute
         */
        getBuildHref: function()
        {
          var dep = this.getDep('mediator/RouteMediator');
          return _.bind(dep.buildHref, dep);
        },

        /**
         *  loadDep
         *  Load a dependency, like a Model or a ViewModel
         *  @param dep_id The fully-qualified dependency ID, i.e. 'models/Scav' or 'viewmodels/ScavViewModel'
         *  @param callback An optional callback that's fired when the dep you're loading is loaded
         */
        loadDep: function(dep_id, callback)
        {
          Debug.log('-> App::loadDep', dep_id);

          if (callback)
            this.on('dep:loaded:' + dep_id.replace(/\//g, ':'), callback);

          if (this.deps[dep_id])
            return this.triggerDepLoad(dep_id);

          require([ dep_id ]);
        },

        /**
         *  getDep
         *  Get a loaded dependency
         *  @param dep_id The fully-qualified dependency ID, i.e. 'models/Scav' or 'viewmodels/ScavViewModel'
         *  @return The depencency you desired - enjoy!
         */
        getDep: function(dep_id)
        {
          return this.deps[dep_id];
        },

        /**
         *  registerDep
         *  Register a dependency with App so others can have access
         *  @param dep_id Your ID (i.e. 'viewmodels/ScavViewModel')
         *  @param dep Your instance (i.e. this)
         *  @usage initialize: function() { App.getInstance().registerDep('foo/bar/Baz', this); }
         */
        registerDep: function(dep_id, dep)
        {
          // Debug.log('-> App::registerDep', dep_id);

          this.deps[dep_id] = dep;
          this.triggerDepLoad(dep_id);
        },

        //Close any open overlays
        closeOverlays: function()
        {
          // Debug.log('App is closing the overlays');
          this.trigger('close:overlays');
        },

        /**
         *  @private
         *  triggerDepLoad
         *  Trigger a dep:loaded event when a dependency has registered itself with App
         *
         *  [Event] dep:loaded(dep_id, dep)
         *  [Event] dep:loaded:<dep_id>(dep_id, dep)
         */
        triggerDepLoad: function(dep_id)
        {
          this.trigger('dep:loaded', dep_id);
          this.trigger('dep:loaded:' + dep_id.replace(/\//g, ':'), this.getDep(dep_id));
        },

        mediatorBridge: function(action, data)
        {
          //Debug.log('App.IOSRouteMediatorBridge.processIOSRequest() - action: ', action);
          //Debug.log('App.IOSRouteMediatorBridge.processIOSRequest() - data: ', data);

          this.get('iOSRouteMediatorBridge').processIOSCommand(action, data);
        }
      },

      {
        instance: null,
        lock: Math.random(),

        /**
         *  getInstance
         *  Get the main instance of App (Singleton pattern)
         */
        getInstance: function()
        {
          if (!this.instance)
          {
            this.instance = new App(this.lock);
            delete this.lock;
          }

          return this.instance;
        },

        /**
         *  noop
         *  No-operation function, useful for optional callbacks (function(foo, callback) { this.on('something', (callback || App.noop)) })
         */
        noop: function() { }
      });

    window.App = App;

    return App;
  }
);
