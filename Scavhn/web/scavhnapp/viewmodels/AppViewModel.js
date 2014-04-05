/**
 * Created by deemadden on 9/11/13.
 */
(function()
{

  var id = 'viewmodels/AppViewModel';

  define(

    id,

    [ 'App',
      'mediator/RouteMediator',
      'utils/Debug' ],

    function(App, RouteMediator, Debug)
    {
      /**
       *  Model for the main "shell" (everything that happens at the parent level of view-root
       */
      return Backbone.Model.extend({
        defaults: {
          view: null
        },

        initialize: function()
        {
          Debug.log('AppViewModel.initialize()');

          Debug.log('App.getInstance()', App.getInstance().registerDep);

          App.getInstance().registerDep(id, this);
        },

        bindObservers: function() {
        },

        unbindObservers: function() {
        },

        deactivate: function()
        {
          this.unbindObservers();
          this.get('view').deactivate();
        },

        activate: function()
        {
          this.get('view').activate();
          this.bindObservers();
        },

        /**
         *  showLoadIndicator
         *  Show the load indicator, blocking all interaction with the site
         */
        showLoadIndicator: function(callback)
        {
          this.get('view').loadIndicatorView.$el.show(0, callback);
        },

        /**
         *  hideLoadIndicator
         *  Hide the load indicator, enabling all interaction with site
         */
        hideLoadIndicator: function(callback)
        {
          this.get('view').loadIndicatorView.$el.hide(0, callback);
        }
      });
    });
})();

