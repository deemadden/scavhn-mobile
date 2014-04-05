define(

  'views/BaseView',

  [ 'helpers/DateFormatter',
    'utils/Debug' ],

  function(DateFormatter, Debug)
  {
    return Backbone.View.extend({

      viewmodel: null,
      isDeviceRunningIOS7: false,
      dateFormatter: null,
      events: {},

      initialize: function(opts)
      {
        Debug.log('BaseView opts', opts);

        if (typeof opts.viewmodel !== 'undefined') {
          this.viewmodel = opts.viewmodel;
        }
        if (typeof opts.view !== 'undefined') {
          this.view = opts.view;
        }

        this.dateFormatter = DateFormatter;

        if (typeof this.onInitialize !== 'undefined') {
          this.onInitialize(opts);
        }
      },

      bindObservers: function()
      {
      },

      unbindObservers: function()
      {
      },

      activate: function(data)
      {
      },

      deactivate: function()
      {
        this.unbindObservers();
      }
    });
  }

);

