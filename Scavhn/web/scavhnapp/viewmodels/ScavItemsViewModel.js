(function()
{

  var id = 'viewmodels/ScavItemsViewModel';

  define(

    id,

    [ 'App',
      'services/ServicesAdapter',
      'mediator/RouteMediator',
      'helpers/CSSHelper',
      'utils/Debug'],

    function(App, ServicesAdapter, RouteMediator, CSSHelper, Debug)
    {
      var ScavItemsViewModel = Backbone.Model.extend({

        defaults: {
          view: null,
          data: null,
          selectedScavItemToVerifyImgUrl: null,
          userName: 'timmypickens'
        },

        initialize: function()
        {
          App.getInstance().registerDep(id, this);
        },

        activateWithData: function(data)
        {
          this.set('data', data);

          this.bindObservers();

          var startDate = new Date();
          var startDateFormatted = startDate.toISOString().slice(0, 19).replace("T", "-");

          Debug.log('startDateTime', startDate.toLocaleString());

          ServicesAdapter.set('selectedScavStartDateTimeObject', startDate);

          // POST to get the data setup for the scavenger hunt
          ServicesAdapter.saveUserScavItemsForScav(data.name, data.id, startDateFormatted);
        },

        deactivate: function()
        {
          this.unbindObservers();

          var view = this.get('view');

          view.deactivate();

          // clean up global vars
          this.set('view', null);
          this.set('data', null);
        },

        bindObservers: function()
        {
          this.get('view').on('quit-scav:click', this.quitScav, this);
          this.get('view').on('verify-found-scav-item:action', this.verifyScavItemFound, this);

          // setup some callback events to bind to for the web service request
          ServicesAdapter.on('getUserScavItemsForScav:success', this.getUserScavItemsForScavSuccess, this);
          ServicesAdapter.on('getUserScavItemsForScav:failure', this.getUserScavItemsForScavFailure, this);
          ServicesAdapter.on('getCurrentHTML5GeolocationPosition:success', this.getPositionSuccess, this);
          ServicesAdapter.on('getCurrentHTML5GeolocationPosition:failure', this.getPositionFailure, this);
          ServicesAdapter.on('verifyScavItemFound:success', this.verifyScavItemFoundSuccess, this);
          ServicesAdapter.on('verifyScavItemFound:failure', this.verifyScavItemFoundFailure, this);
          ServicesAdapter.on('saveScavItemPictureTakenByPlayer:success', this.saveScavItemPictureTakenByPlayerSuccess, this);
          ServicesAdapter.on('saveScavItemPictureTakenByPlayer:failure', this.saveScavItemPictureTakenByPlayerFailure, this);
        },

        unbindObservers: function()
        {
          this.get('view').off('quit-scav:click', this.quitScav, this);
          this.get('view').off('verify-found-scav-item:action', this.verifyScavItemFound, this);

          // unbind any callback events created when unloading
          ServicesAdapter.off('getUserScavItemsForScav:success', this.getUserScavItemsForScavSuccess, this);
          ServicesAdapter.off('getUserScavItemsForScav:failure', this.getUserScavItemsForScavFailure, this);
          ServicesAdapter.off('getCurrentHTML5GeolocationPosition:success', this.getPositionSuccess, this);
          ServicesAdapter.off('getCurrentHTML5GeolocationPosition:failure', this.getPositionFailure, this);
          ServicesAdapter.off('verifyScavItemFound:success', this.verifyScavItemFoundSuccess, this);
          ServicesAdapter.off('verifyScavItemFound:failure', this.verifyScavItemFoundFailure, this);
          ServicesAdapter.off('saveScavItemPictureTakenByPlayer:success', this.saveScavItemPictureTakenByPlayerSuccess, this);
          ServicesAdapter.off('saveScavItemPictureTakenByPlayer:failure', this.saveScavItemPictureTakenByPlayerFailure, this);
        },

        getUserScavItemsForScavSuccess: function()
        {
          Debug.log('ScavItemsViewModel > saveUserScavItemsForScavSuccess', ServicesAdapter.get('selectedScav').get('name'));

          // Take the duration value and build a new Date object that is current time + Scav.duration
          // into the future
          ServicesAdapter.calculateScavExpiry();

          this.get('view').activate(this.viewData());
        },

        getUserScavItemsForScavFailure: function(xhr, status, errorHolder)
        {
          Debug.log('Didn\'t get the Scav items requested.', xhr, status, errorHolder);
        },

        verifyScavItemFound: function(data)
        {
          // Set as the last item player attempted to locate
          // for updating the heads-up display in the view
          ServicesAdapter.setRecentScavItem(data.selectedScavItemId);

          // Hang on to the info about the scav item the player believes he/she has discovered
          // We're going to do something with it later, but first...
          // Hang on to some info we're going to need later
          this.set('selectedScavItemToVerifyImgUrl', data.imgURL);

          // Now get the current geolocation and heading
          ServicesAdapter.getCurrentHTML5GeolocationPosition();
        },

        getPositionSuccess: function(position)
        {
          if(position)
          {
            var data = {
              scavMongoId: ServicesAdapter.get('selectedScav').get('scavMongoId'),
              scavItemId: ServicesAdapter.getRecentScavItem().get('_id'),
              scavItemName: ServicesAdapter.getRecentScavItem().get('name'),
              heading: position.coords.heading ? position.coords.heading.toString() : null,
              latitude: position.coords.latitude.toString(),
              longitude: position.coords.longitude.toString(),
              altitude: position.coords.altitude.toString(),
              altitudeAccuracy: position.coords.altitudeAccuracy.toString(),
              accuracy: position.coords.accuracy.toString()
            };

            ServicesAdapter.verifyScavItemFound(data);
          }
          else
          {
            Debug.log('ScavItemsViewModel > getPositionSuccess: A problem occurred obtaining the position.');
          }
        },

        getPositionFailure: function()
        {
          Debug.log('ScavItemsViewModel > getPositionSuccess: A problem occurred obtaining the position.');
        },

        verifyScavItemFoundSuccess: function()
        {
          Debug.log('ScavItemsViewModel > verifyScavItemFoundSuccess');
          this.updateItemAndSavePictureTakenWithFoundState('FOUND');
        },

        verifyScavItemFoundFailure: function()
        {
          Debug.log('ScavItemsViewModel > verifyScavItemFoundFailure: An error occurred verifying the Scav Item located.');
          this.updateItemAndSavePictureTakenWithFoundState('ACTIVE');
        },

        saveScavItemPictureTakenByPlayerSuccess: function()
        {
          Debug.log('ScavItemsViewModel > saveScavItemPictureTakenByPlayerSuccess');

          var headerData = this.buildViewDataForScavItemsHeader();
          var selectedScav = ServicesAdapter.get('selectedScav');
          var currentScavItemsLeftTotal = selectedScav.get('items').where({ status: 'ACTIVE' }).length;

          currentScavItemsLeftTotal == 0
            ? this.get('view').updateScavGameComplete(headerData)
            : this.get('view').updateCameraViewWithResult(headerData);
        },

        saveScavItemPictureTakenByPlayerFailure: function()
        {
          Debug.log('ScavItemsViewModel > saveScavItemPictureTakenByPlayerFailure');

          var headerData = this.buildViewDataForScavItemsHeader();

          this.get('view').updateCameraViewWithResult(headerData);
        },

        quitScav: function()
        {
          // Clean out the start time
          ServicesAdapter.set('selectedScavStartDateTimeObject', null);
          RouteMediator.navigateTo('homeScreen', {});
        },

        viewData: function() {

          // Should return a dictionary of any data the view will need at render time
          // key: this.getSomeSortOfData() - good pattern for testability
          // somewhere in the success callback on the last service call needed, you'll
          // do something like:
          // this.get('view').activate(this.viewData());

          var selectedScav = ServicesAdapter.get('selectedScav');
          var scavThumbnailUrl = CSSHelper.getBackgroundURLPathForAnchor('scavitemsscreen',
                                                                         selectedScav.get('thumbnail'),
                                                                         selectedScav.get('thumbnailType'),
                                                                         true,
                                                                         '#ffffff',
                                                                         null);
          var scavItems = selectedScav.get('items');

          var items = [];

          for (var item = 0; item < scavItems.length; item++) {
          	var currentItem = scavItems.at(item);
            var imageURLSm = CSSHelper.getBackgroundURLPathForAnchor('scavitemsscreen/itemstofind', currentItem.get('thumbnail'), currentItem.get('thumbnailType'), false, null, 'sm');
            var imageURLLg = CSSHelper.getBackgroundURLPathForAnchor('scavitemsscreen/itemstofind', currentItem.get('thumbnail'), currentItem.get('thumbnailType'), false, null, 'lg');

            // Truncate the string, until we can get the description wrapping, or control the length of the hint later on
            var hint = currentItem.get('hint').length > 30 ? currentItem.get('hint').substring(0, 30) + '...' : currentItem.get('hint');

          	items.push({
          		id: currentItem.get('_id'),
          		imageURLSm: imageURLSm,
              imageURLLg: imageURLLg,
          		name: currentItem.get('name'),
          		points: currentItem.get('pointValue'),
          		hint: hint,
              fullHint: currentItem.get('hint')
          	});
          }

          var recentItem = ServicesAdapter.getRecentScavItem();

          var dataForView = {
            isDeviceRunningIOS7: ServicesAdapter.get('isDeviceRunningIOS7'),
            scavId: selectedScav.get('_id'),
            scavName: selectedScav.get('name'),
            scavItems: items,
            recentItem: (recentItem != null) ? recentItem.get('name') : 'No recent item',
            pointTotal: this.getScavItemsFoundPointTotal(selectedScav),
            duration: selectedScav.get('duration'),
            expiryDate: ServicesAdapter.get('selectedScavExpiryDateTimeObject'),
            scavItemsFound: selectedScav.get('items').where({ status: 'FOUND' }).length,
            scavItemsLeft: selectedScav.get('items').where({ status: 'ACTIVE' }).length,
            thumbnailImageURL: scavThumbnailUrl,
            buildHref: this.getBuildHref()
          };

          Debug.log('ScavItemsViewModel > dataForView', dataForView);

          return dataForView;
        },

        buildViewDataForScavItemsHeader: function () {
          var selectedScav = ServicesAdapter.get('selectedScav');
          var scavItemStatus = ServicesAdapter.getRecentScavItem().get('status');
          var recentScavItemName = ServicesAdapter.getRecentScavItem().get('name');
          var currentScavItemsLeftTotal = selectedScav.get('items').where({ status: 'ACTIVE' }).length;

          Debug.log('selected scav items: ', selectedScav.get('items'));
          Debug.log('currentScavItemsLeftTotal', currentScavItemsLeftTotal);

          // Clear the base64 version of the image out of memory.
          // It's taking a big chunk, and we don't need to keep it around.
          this.set('selectedScavItemToVerifyImgUrl', null);

          var data = {
            scavItemStatus: scavItemStatus,
            recentScavItemName: recentScavItemName,
            currentPointTotal: scavItemStatus == 'FOUND' ? this.getScavItemsFoundPointTotal(selectedScav) : null,
            currentScavItemsFoundTotal: scavItemStatus == 'FOUND' ? selectedScav.get('items').where({ status: 'FOUND' }).length : null,
            currentScavItemsLeftTotal: scavItemStatus == 'FOUND' ? currentScavItemsLeftTotal : null
          };

          return data;
        },

        getBuildHref: function()
        {
          return (App.getInstance().getBuildHref());
        },

        getScavItemsFoundPointTotal: function (selectedScav)
        {
          var scavItemsFound = selectedScav.get('items').where({ status: 'FOUND' });

          // Because this is an array of Backbone models, we have to pluck the attributes for each model,
          // THEN pluck the pointValue from that
          var scavItemsPointValuesArray = _.pluck(_.pluck(scavItemsFound, 'attributes'), 'pointValue');

          // Now that we've got a raw array of pointValues, we can tally them up using Underscore's reduce
          return _.reduce(scavItemsPointValuesArray, function (memo, num) { return parseInt(memo) + parseInt(num) }, 0);
        },

        updateItemAndSavePictureTakenWithFoundState: function(scavItemStatus)
        {
          ServicesAdapter.getRecentScavItem().set('status', scavItemStatus);
          ServicesAdapter.getRecentScavItem().set('dateTimeFoundAttempt', new Date());

          var data = {
            userName: this.get('userName'),
            scavName: ServicesAdapter.get('selectedScav').get('name'),
            scavItemId: ServicesAdapter.getRecentScavItem().get('_id'),
            imgUrl: this.get('selectedScavItemToVerifyImgUrl')
          };

          ServicesAdapter.saveScavItemPictureTakenByPlayer(data);
        }

      });

      return new ScavItemsViewModel();
    }
  );
})();
