/**
 * Created by deemadden on 9/11/13.
 */
(function()
{

  var id = 'viewmodels/HomeScreenViewModel';

  define(

    id,

    [ 'App',
      'services/ServicesAdapter',
      'mediator/RouteMediator',
      'helpers/CSSHelper',
      'utils/Debug' ],

    function(App, ServicesAdapter, RouteMediator, CSSHelper, Debug)
    {
      var HomeScreenViewModel = Backbone.Model.extend({

        defaults: {
          view: null
        },

        initialize: function()
        {
          App.getInstance().registerDep(id, this);
        },

        activateWithData: function()
        {
          this.bindObservers();

          ServicesAdapter.getScavs();
        },

        deactivate: function()
        {
          this.unbindObservers();

          var view = this.get('view');

          view.deactivate();

          // clean up global vars
          this.set('view', null);
        },

        bindObservers: function()
        {
          // wire up all click events
          this.get('view').on('begin-scav:click', this.beginScav, this);
          this.get('view').on('scav-selected:click', this.setCurrentScav, this);

          // setup some callback events to bind to for the web service request
          ServicesAdapter.on('getScavs:success', this.getScavsSuccess, this);
          ServicesAdapter.on('getScavs:failure', this.getScavsFailure, this);
          ServicesAdapter.on('getCurrentHTML5GeolocationPosition:success', this.getPositionSuccess, this);
          ServicesAdapter.on('getCurrentHTML5GeolocationPosition:failure', this.getPositionFailure, this);
        },

        unbindObservers: function()
        {
          // unbind everything when leaving the view
          this.get('view').off('begin-scav:click', this.beginScav, this);
          this.get('view').off('scav-selected:click', this.setCurrentScav, this);

          ServicesAdapter.off('getScavs:success', this.getScavsSuccess, this);
          ServicesAdapter.off('getScavs:failure', this.getScavsFailure, this);
          ServicesAdapter.off('getCurrentHTML5GeolocationPosition:success', this.getPositionSuccess, this);
          ServicesAdapter.off('getCurrentHTML5GeolocationPosition:failure', this.getPositionFailure, this);
        },

        // ServicesAdapter callbacks
        getScavsSuccess: function()
        {
          Debug.log('HomeScreenViewModel > getScavsSuccess!', ServicesAdapter.get('scavs'));

          ServicesAdapter.getCurrentHTML5GeolocationPosition();
        },

        getScavsFailure: function(xhr, status, errorHolder)
        {
          Debug.log('Didn\'t get the Scavs requested.', xhr, status, errorHolder);
        },

        getPositionSuccess: function()
        {
          Debug.log('HomeScreenViewModel > getPositionSuccess!');

          this.get('view').activate(this.viewData());
        },

        getPositionFailure: function()
        {
          Debug.log('HomeScreenViewModel > getPositionFailure: an error occurred retrieving the current geolocation info.');
        },

        // Click event methods
        setCurrentScav: function(selectedScavId)
        {
          ServicesAdapter.set('currentScavId', selectedScavId);
        },

        beginScav: function()
        {
          Debug.log('beginScav Clicked.');

          var currentScavId = ServicesAdapter.get('currentScavId');
          var selectedScav = ServicesAdapter.get('scavs').findWhere({ '_id': ServicesAdapter.get('currentScavId')});

          ServicesAdapter.set('selectedScav', selectedScav);

//          RouteMediator.navigateTo('scavItemsViewScreen', {
//            id: selectedScav.get('_id'),
//            name: selectedScav.get('name')
//          });

          // NAVIGATE TO SCAVITEMS VIEW WITH NATIVE CAMERA
          RouteMediator.navigateTo('scavItemsNativeViewScreen', {
            id: selectedScav.get('_id'),
            name: selectedScav.get('name')
          });
        },

        // viewData method is required convention in all Scavhn viewmodels.
        // It should return a dictionary of any data the view will need at render time
        // key: this.getSomeSortOfData() - good pattern for testability
        // somewhere in the success callback on the last service call needed, you'll do something like
        // this.get('view').activate(this.viewData());
        viewData: function() {

          var scavs = ServicesAdapter.get('scavs');

          var scavCollectionForView = [];

          for(var i = 0; i < scavs.length; i++)
          {
            var scavImageUrl = CSSHelper.getBackgroundURLPathForAnchor('homescreen', scavs.at(i).get('image'), scavs.at(i).get('imageType'), false, null, null);

            var scavDataForView = {
              'id': scavs.at(i).get('_id'),
              'name': scavs.at(i).get('name'),
              'level': scavs.at(i).get('level'),
              'backgroundImageURL': scavImageUrl
            };

            scavCollectionForView.push(scavDataForView);
          }

          return { 'scavViewData': scavCollectionForView };
        }
      });

      return new HomeScreenViewModel();
    }
  );
})();
