define(

  'views/HomeScreenView',

  [ 'App',
    'views/BaseView',
    'text!partials/home-screen.html',
    'utils/Debug' ],

  function(App, BaseView, template, Debug)
  {
    return BaseView.extend({

      cachedTemplate: _.template(template),

      scavCollection: null,

      events: {
        'click .begin-scav-action a': 'beginScavClick',
        'click .scav-level-items a': 'selectScavClick'
      },

      onInitialize: function(opts)
      {
      },

      activate: function(data)
      {
        Debug.log('HomeScreenView -> activate()');

        this.scavCollection = data.scavViewData;

        this.render();
      },

      deactivate: function()
      {
        this.undelegateEvents();
      },

      render: function()
      {
        this.$el.html(this.cachedTemplate({
          title: 'Select Difficulty',
          buttonLabel: 'Begin',
          scavCollection: this.scavCollection
        }));

        this.resetHighlightedScavItems();

        this.delegateEvents();
      },

      selectScavClick: function(e)
      {
        e.preventDefault();

        Debug.log('selectScavClick');

        this.resetHighlightedScavItems();

        this.highlightSelectedItem(e);

        this.updateBeginButtonState();

        this.trigger('scav-selected:click', $(e.currentTarget).data('scavid'));
      },

      beginScavClick: function(e)
      {
        e.preventDefault();

        if(this.isBeginButtonDisabled(e))
          return;

        this.trigger('begin-scav:click');
      },

      // Helper methods
      resetHighlightedScavItems: function()
      {
        var $highlightedScavElements = $('div[class$=\'highlighted\']');
        $highlightedScavElements.hide();

        var $ctasText = $('div[class$=\'item\'] a span');

        if($ctasText.hasClass('highlight-cta-text'))
          $ctasText.removeClass('highlight-cta-text');
      },

      highlightSelectedItem: function(e)
      {
        var $highlightedElementForScavTouched = $(e.currentTarget).siblings('div[class$=\'highlighted\']');
        $highlightedElementForScavTouched.show();

        var $ctaText = $(e.currentTarget).children('span');

        if(!$ctaText.hasClass('highlight-cta-text'))
          $ctaText.toggleClass('highlight-cta-text');
      },

      updateBeginButtonState: function()
      {
        var $beginButton = $('.begin-scav-action a');

        if ($beginButton.hasClass('ui-cta-large-disabled'))
          $beginButton.toggleClass('ui-cta-large-disabled');
      },

      isBeginButtonDisabled: function(e)
      {
        return $(e.currentTarget).hasClass('ui-cta-large-disabled');
      }
    });
  }
);
