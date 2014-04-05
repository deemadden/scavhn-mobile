define(

  'views/LoadIndicatorView',

  [ 'views/BaseView',
    'text!partials/load-indicator.html',
    'utils/Debug' ],

  function(BaseView, template, Debug)
  {
    return BaseView.extend({

      cachedTemplate: _.template(template),

      onInitialize: function()
      {
        this.render();
      },

      render: function()
      {
        Debug.time("render-LoadIndicatorView");

        this.$el.html(this.cachedTemplate({
          strings: 'Loading...'
        }));

        Debug.timeEnd("render-LoadIndicatorView");
      }
    });
  }

);
