define(
  
  'views/Overlay',
  
  [ 'App', 'text!partials/overlay.html' ],
  
  function(App, template)
  {
    /**
     *  Overlay
     *  Provides a standard interface for an overlay
     *  
     *  TODO:
     *    - destroy()
     *  
     *  [Events]
     *  ui-overlay:close - fired when... closed.
     */
    return Backbone.View.extend({
      
      content_view: null,
      appends_to: $(document.body),
      
      content_block_width: 500,
      
      events: {
        'click .ui-overlay-close a': 'close'
      },
      
      /**
       *  initialize
       *  
       *  Required params:
       *    - opts.content_view - a Backbone view to load into this view
       *  
       *  Optional params:
       *    - class_name - append a class to the main ui-overlay div to ease styling
       *    - blocker_closes - allow the blocker to close the modal. Default is false
       *    - content_block_width - change the width of the overlay's content
       *  
       */
      initialize: function(opts)
      {
        this.content_view = opts.content_view;
        this.content_block_width = opts.content_block_width || this.content_block_width;
        
        // Listen for the content_view to tell us to close
        this.content_view.on('overlay-child:close', this.close, this);
        
        if (opts.class_name)
          this.$el.addClass(opts.class_name);
        
        if (opts.blocker_closes)
          this.events['click .ui-overlay-blocker'] = 'blockerClose';

      },

      render: function()
      {
        if (this.$el)
          this.$el.remove();
        
        var winWidth = $(window).width();
        var winHeight = $(window).height();

        this.$el.appendTo(this.appends_to);
        this.$el.html(_.template(template, {}));

        this.$el.css({
          width:winWidth,
          height:winHeight,
          position:'absolute',
          top:0,
          left:0
        });
        
        this.setContentBlockWidth();
        
        this.content_view.setElement(this.$('.ui-overlay-content'));
        this.content_view.render();
        
        this.delegateEvents();
        
        this.$('.ui-overlay-close').touchify();

        this.bindObservers();
      },

      bindObservers: function() {
        App.getInstance().on('close:overlays', _.bind(this.close, this));
      },
      
      blockerClose: function(e)
      {
        e.preventDefault();

        // Quick fix for when more than one overlay exists within a view and one wants the blocker to close it and the other doesn't
        if (!this.content_view.dont_let_blocker_close)
          this.close(e);
      },
      
      close: function(e)
      {
        if (e)
          e.preventDefault();
        
        if (this.content_view.deactivate)
          this.content_view.deactivate();
          
        this.content_view.off('overlay-child:close', this.close, this);
        
        this.trigger('ui-overlay:close');
        this.content_view.trigger('ui-overlay:close');

        if (this.$el)
          this.$el.remove();
      },
      
      /**
       *  Override the width (default's 500px) of the overlay. Only call this after it's been rendered
       */
      setContentBlockWidth: function(width)
      {
        width = width || this.content_block_width;
        
        var $block = this.$('.ui-overlay-content-block');
        
        $block.css('width', width);
        $block.css('marginLeft', -(width / 2));
      }
      
    });
  }
  
);
