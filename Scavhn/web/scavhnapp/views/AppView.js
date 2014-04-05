define(

  'views/AppView',

  [ 'views/LoadIndicatorView',
    'utils/Debug' ],

  function(LoadIndicatorView, Debug)
  {
    /**
     *  AppView
     *  Main view container, used solely for doing any work needed at the $('.view-root') level
     *  Usage: new my_view({ el: App.getInstance().get('view').el });
     */
    return Backbone.View.extend({

      orientation: 'portrait',

      viewmodel: null,

      loadIndicatorView: null,

      // selector for load spinner overlay
      loader_root: '.load-indicator-root',

      initialize: function(opts)
      {
        Debug.log('AppView.initialize()');

        this.viewmodel = opts.viewmodel;

        $(window)
          .on('orientationchange', _.bind(this.orientationChange, this))
          .on('resize', _.bind(this.windowResize, this))
          .trigger('orientationchange')
          .trigger('resize');
      },

      activate: function()
      {
        this.loadIndicatorView = new LoadIndicatorView({ viewmodel: this.viewmodel, el: $(this.loader_root) });
      },

      deactivate: function()
      {
      },

      orientationChange: function(e)
      {
        var set_to = 'portrait';

        if (!isNaN(window.orientation) && (window.orientation === 0 || window.orientation === 180))
          set_to = 'portrait';

        $(document.body).removeClass('landscape portrait').addClass(set_to);

        this.orientation = set_to;
        this.trigger('orientation:change', this.orientation);
      },

      windowResize: function(e)
      {
        this.trigger('window:resize');
      }

    });
  }

);
