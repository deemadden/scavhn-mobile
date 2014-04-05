define(
  
  'views/WebServiceErrorDialogView',
  
  [ 'views/BaseView',
    'text!partials/webservice-error-dialog.html' ],
  
  function(BaseView, template)
  {
    return BaseView.extend({
      
      callback: null,
      params: null,
      cachedTemplate: _.template(template),
      
      events: {
        'click .webservice-general-fail-ok': 'buttonClicked', 
        'ui-overlay:close': 'failureCallback'
      },
      
      onInitialize: function(opts)
      {
        this.callback = opts.callback;
        this.params = opts.params;
      },
      
      render: function()
      {
        this.$el.html(this.cachedTemplate({
          strings: 'An error occurred on service call.'
        }));

        new FastClick(this.$el);
        
        this.delegateEvents();
      },
      
      buttonClicked: function(e)
      {
        e.preventDefault();
        
        this.trigger('overlay-child:close');
      },
      
      failureCallback: function()
      {
        this.callback.call(this, this.params);
      }
    });
  }
);
