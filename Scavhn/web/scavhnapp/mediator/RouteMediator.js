(function()
{

  var id = 'mediator/RouteMediator';

  define(

    id,

    [ 'App',
      'mediator/Router',
      'mediator/RouteStore',
      'utils/Debug' ],

    function(App, Router, RouteStore, Debug)
    {
      var RouteMediator = Backbone.Model.extend({
        
        defaults: {
          routeStore: null,
          
          // Store the current route name
          currentRouteName: null,

          // Store the current depId (which is a ViewModel) so when it loads we know what we're looking for
          currentDepViewModelLoading: null,
          currentDepViewLoading: null,
          
          // Store the current route data, so we can pass it to the ViewModel when it loads
          currentRouteData: null,
          
          // Store the last dep, so we can tell it to not bother rendering
          lastDepViewModelLoaded: null,
          lastDepViewLoaded: null,

          // Store the fragment we came from, so we can use it to do something special with the view we are navigating to
          lastRouteFragment: null
        },

        initialize: function()
        {
          Debug.log('RouteMediator.initialize()');
          
          // Bind the callback's scope
          var callback = _.bind(this.handleRoute, this);
          this.set('router', new Router());
          this.set('routeStore', new RouteStore({ router: this.get('router'), callback: callback }));
          
          // Listen to all dependency load events
          // App.getInstance().on('dep:loaded', _.bind(this.depLoaded, this));
          
          // Need to register AFTER instantiating RouteStore, because App calls createRoutes immediately,
          // which fails without routeStore being set
          App.getInstance().registerDep(id, this);
        },
        
        /**
         *  createRoutes
         *  Proxy to the store to create the routes
         */
        createRoutes: function()
        {
          this.get('routeStore').createRoutes();
        },
        
        /**
         *  navigateTo
         *  @param routeName The name of the route, i.e. 'retailerDashboard'
         *  @param data Extra data to populate the URL with, unique per-route
         */
        navigateTo: function(routeName, data)
        {
          this.set('lastRouteFragment', Backbone.history.fragment);

          var route = this.get('routeStore').getRoute(routeName);
          var fragment = this.buildRoute(route.get('name'), data);
          
          this.get('router').navigate(fragment, { trigger: false });
          
          this.handleRoute(routeName, data);
        },

        /**
         *  handleRoute
         *  Called from the routeStore when a route is matched
         *  @param routeName The name of the route, like 'retailerDashboard'
         *  @param data Any data that's in the url
         */
        handleRoute: function(routeName, data)
        {
          //Debug.time("handleRoute");
          Debug.log('RouteMediator->handleRoute', routeName, data);

          var depViewId = this.get('routeStore').getDepViewId(routeName);
          var depViewModelId = this.get('routeStore').getDepViewModelId(routeName);

          this.set('currentRouteName', routeName);
          this.set('currentRouteData', data);

          this.set('lastDepViewLoaded', this.get('currentDepViewLoading'));
          this.set('lastDepViewModelLoaded', this.get('currentDepViewModelLoading'));

          this.set('currentDepViewLoading', depViewId);
          this.set('currentDepViewModelLoading', depViewModelId);

          /**
           * Here we use the viewModel id because it registers itself with App.
           */
          if (App.getInstance().getDep(depViewModelId))
          {
            /**
             * view, viewModel were loaded already
             * get the copies from App and require.
             */
            var view = require(depViewId);
            var viewModel = App.getInstance().getDep(depViewModelId);

            this.dependenciesLoaded(view, viewModel);
          }
          else
          {
            /**
             * Loads the view, viewModel asynchronously.
             */
            require([depViewId, depViewModelId], _.bind(this.dependenciesLoaded, this));
          }
        },

        /**
         *  dependenciesLoaded
         *  Callback after the view and viewModel load complete.
         *  @param view The view Class.
         *  @param viewModel The viewModel instance.
         */
        dependenciesLoaded: function(view, viewModel)
        {
          this.set('currentDepViewLoading', view);
          this.currentDepLoaded();
        },

        /**
         *  currentDepLoaded
         *  Called when the current dep has been loaded and is ready to manipulate
         *  [Event] 'navigate:<route name>' (i.e. 'navigate:retailerDashboard')
         */
        currentDepLoaded: function()
        {
          Debug.timeEnd("handleRoute->RouteMediator.currentDepLoaded");

          var lastDepViewModelLoaded = this.get('lastDepViewModelLoaded');

          if (lastDepViewModelLoaded)
          {
            /**
             * The viewModel should call view.deactivate() too.
             */
            App.getInstance().getDep(lastDepViewModelLoaded).deactivate();
          }

          /**
           * Get current viewModel from the App dependencies list.
           */
          Debug.log('currentDepViewModelLoading', this.get('currentDepViewModelLoading'));

          var viewModel = App.getInstance().getDep(this.get('currentDepViewModelLoading'));

          Debug.log('viewModel', viewModel);

          /**
           * Get the view Class that was just loaded through require.
           */
          var viewClass = this.get('currentDepViewLoading');

          /**
           * Instantiate the view. set dependencies.
           */
          var view = new viewClass({
            viewmodel: viewModel,
            el: App.getInstance().get('view').el
          });

          viewModel.set('view', view);

          /**
           * Activate the viewModel with the current route data.
           */
          viewModel.activateWithData(this.get('currentRouteData'));

          this.trigger('navigate:' + this.get('currentRouteName'));

          window.scrollTo(0, 0);
        },
        
        /**
         *  buildRoute
         *  Builds a fragment from a route
         *  @param name The route name, i.e. home
         *  @param data Data to populate, i.e. { id: '1' }
         *  @return The full route, i.e. scav/vulture/itemView
         */
        buildRoute: function(name, data)
        {
          data = data || {};
          
          var route = this.get('routeStore').getRoute(name);
          var out = route.get('route');
          
          // Regex is from Backbone's source
          var matches = out.match(/:\w+/g);
          
          if(matches !== null){
            for (var i = 0, l = matches.length; i<l; i++)
              out = out.replace(matches[i], data[matches[i].substr(1)] || '');
          }
          
          return out;
        },
        
        buildHref: function(name, data)
        {
          return '#' + this.buildRoute(name, data);
        }
        
      });
      
      return new RouteMediator();
    });
})();