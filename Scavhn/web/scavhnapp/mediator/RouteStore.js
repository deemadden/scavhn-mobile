define(

  'mediator/RouteStore',

  [ ],

  function()
  {
    /**
     *  Data store for all routes
     */
    return Backbone.Model.extend({

      defaults: {
        routes: null,
        router: null,
        callback: null
      },

      /**
       *  initialize
       *  @param opts Hash of { router: App router, callback: callback }
       */
      initialize: function(opts)
      {
        this.set('router', opts.router);
        this.set('callback', opts.callback);

        this.set('routes', new Backbone.Collection());
      },

      /**
       *  createRoutes
       *  This is where each route is defined
       */
      createRoutes: function()
      {
        var self = this;

        // Home Screen
        this.addRoute('home', 'homeScreen', 'views/HomeScreenView', 'viewmodels/HomeScreenViewModel', function(id) { self.handleRoute(this.get('name'), { id: id }); });

        // Scav Item View
        this.addRoute('scav/:id', 'scavItemsViewScreen', 'views/ScavItemsView', 'viewmodels/ScavItemsViewModel', function(id) { self.handleRoute(this.get('name'), { id: id }); });

        // Scav Item View with native camera
        this.addRoute('scav/:id', 'scavItemsNativeViewScreen', 'views/ScavItemsNativeView', 'viewmodels/ScavItemsNativeViewModel', function(id) { self.handleRoute(this.get('name'), { id: id }); });

        // Camera View
        this.addRoute('camera/:id', 'cameraScreen', 'views/CameraView', 'viewmodels/CameraViewModel', function(id) { self.handleRoute(this.get('name'), { id: id }); });
      },

      
      /**
       *  addRoute
       *  Add a route to the router
       *  @param route Fragment to match
       *  @param name Name, which is used globally
       *  @param view we're trying to navigate to. views and viewmodels are decoupled for testability and to keep a nice clean encapsulation, so they are loaded independently of one another.
       *  @param viewmodel Short identifier for loading the ViewModel. Used by RouteStore::getDepId
       *  @param callback A function that's scoped to the model instance, that should call RouteStore::handleRoute, passing in its own router name and the data to send to the ViewModel
       */
      addRoute: function(route, name, view, viewmodel, callback)
      {
        // Create a new model, to store in the routes collection
        var model = new Backbone.Model({
          route: route,
          name: name,
          view: view,
          viewmodel: viewmodel
        });
        
        this.get('routes').add([ model ]);
        
        // Set the fragment, name and callback, **binding the callback to the model's scope**.
        // So the callback's "this" keyword will be the model.
        this.get('router').route(route, name, _.bind(callback, model));
      },
      
      /**
       *  handleRoute
       *  Called by the route callback set in RouteStore::addRoute. Calls RouteMediator::handleRoute
       *  @param routeName The name of the route
       *  @param data The data pulled out of the URL that is sent to the callback by Backbone.Router
       */
      handleRoute: function(routeName, data)
      {
        this.get('callback').apply(null, [ routeName, data ]);
      },
      
      /**
       *  getRoute
       *  Helper to get the route model (which is created in addRoute) from the routes collection
       *  @param routeName Named route to get
       *  @return Route model
       */
      getRoute: function(routeName)
      {
        return this.get('routes').find(function(route) { return route.get('name') == routeName; });
      },
      
      /**
       *  getDepView/ViewModelId
       *  Helper to turn the route model's viewmodel attribute into an actual dependency ID, for App::loadDep or App::getDep
       *  @param routeName Named route to get
       *  @return Fully-qualified depId, i.e. 'viewmodels/HomeScreenViewModel'
       */
      getDepViewId: function(routeName)
      {
        var route = this.getRoute(routeName);
        return route.get('view');
      },

      getDepViewModelId: function(routeName)
      {
        var route = this.getRoute(routeName);
        return route.get('viewmodel');
      }
    });
  }
  
);
