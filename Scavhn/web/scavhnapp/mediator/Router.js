define(

  'mediator/Router',

  [ ],

  function()
  {
    /**
     *  Router
     *  Main application router/controller, handles all routes and dispatched accordingly
     *  Sample usage:
     *  Define a a route: App.getInstance().get('router').route('my/route', 'my_route_name', _.bind(this.onMyRoute, this));
     *  ...
     *  Define a callback and do something: onMyRoute: function() { Debug.log('navigated to my/route'); }
     */
    return Backbone.Router.extend({

      routes: {},

      initialize: function()
      {
        /**
         * Prevent errors during tests.
         */
        //window.location.hash = '';
        if(!Backbone.History.started) Backbone.history.start({ pushState: false });
      }
    });
  }

);