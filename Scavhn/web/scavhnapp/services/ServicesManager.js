/**
 * Created by deemadden on 9/11/13.
 */
define(

  'services/ServicesManager',

  [ 'App',
    'settings',
    'views/WebServiceErrorDialogView',
    'views/Overlay',
    'utils/Debug' ],

  function(App, settings, WebServiceErrorDialogView, Overlay, Debug)
  {
    var baseURL = settings.servicesBaseURL;
    var defaultUser = settings.defaultUser;
    var appViewModelId = 'viewmodels/AppViewModel';
    var overlay = null;
    var webServiceErrorDialogView = null;

    var request = function(method, url, data, successCallback, failureCallback, silent, failureCallbackOverRide, bypassIOSInterceptor)
    {
      silent = (silent === undefined) ? false : silent;
      failureCallbackOverRide = (failureCallbackOverRide === undefined) ? false : failureCallbackOverRide;
      bypassIOSInterceptor = (bypassIOSInterceptor === undefined) ? false : bypassIOSInterceptor;

      if(data !== null)
        Debug.log('\nSERVICES MANAGER - Sending request', method, url, 'with data:', data);
      else
        Debug.log('\nSERVICES MANAGER - Sending request', method, url);

      var startTime = new Date();

      $.ajax({
        type: method,
        contentType: 'application/json',
        url: _servicesManager.getBaseUrl() + url,
        data: data,
        dataType: 'text', //'json',
        cache: false, // isHostedByServer,
        beforeSend: function(xhr)
        {
          if (!silent)
            App.getInstance().getDep(appViewModelId).showLoadIndicator();

          if(bypassIOSInterceptor)
            xhr.setRequestHeader('X-HTTP-PASSTHRU', 'TRUE');
        },
        success: function(data, status, request)
        {
          var json = jQuery.parseJSON( data );

          var size = request.getResponseHeader('Content-Length');
          var suffix = ["bytes", "KB", "MB", "GB", "TB", "PB"];
          var tier = 0;
          while(size >= 1024) {
            size = size / 1024;
            tier++;
          }

          size = Math.round(size * 10) / 10 + " " + suffix[tier];

          Debug.log('SERVICES MANAGER - Received SUCCESS for request', (new Date() - startTime) + 'ms', size, method, url, json);

          if (!silent)
            App.getInstance().getDep(appViewModelId).hideLoadIndicator();

          successCallback(json);
        },
        error: function(xhr, status, error)
        {
          Debug.log('SERVICES MANAGER - Received FAILURE for request', method,  url, 'with status:', status, 'and error:', error);

          if (!silent)
            App.getInstance().getDep(appViewModelId).hideLoadIndicator();

          if(!failureCallbackOverRide)
          {
            displayGeneralErrorMessage(failureCallback, [xhr, status, error]);
            overlay.render();
          }
          else
          {
            failureCallback(xhr, status, error);
          }
        }
      });
    };

    var displayGeneralErrorMessage = function(failureCallback, params)
    {
      if (!overlay && !webServiceErrorDialogView)
      {
        webServiceErrorDialogView = new WebServiceErrorDialogView({
          callback:failureCallback,
          params:params
        });
        overlay = new Overlay({
          content_view: webServiceErrorDialogView,
          class_name: 'ui-confirm',
          blocker_closes: true
        });
      }
    };

    var formatParams = function(params)
    {
      if (!params)
        return "";

      var paramString = "";

      for (var param in params)
        paramString += encodeURIComponent(param) + "=" + encodeURIComponent(params[param]) + "&";

      return "?" + paramString.replace(/&$/, "");
    };

    var _servicesManager = {
      ServicesAdapter: null,

      setServicesAdapterReference: function (ref) {
        this.ServicesAdapter = ref;
      },

      getBaseUrl: function () {
        return baseURL;
      },

      getScavs: function(successCallback, failureCallback)
      {
        request('GET', '/scavs', null, successCallback, failureCallback, false, true);
      },

      saveUserScavItemsForScav: function(data, successCallback, failureCallback) {
        request('POST', '/users/' + defaultUser + '/scavs/' + data.name,
          JSON.stringify({ originalScavId: data._id, userScavStartTime: data.startTime }),
          successCallback,
          failureCallback,
          false,
          true);
      },

      getUserScavItemsForScav: function(data, successCallback, failureCallback)
      {
        Debug.log('ServicesManager.getUserScavItemsForScav', data.name);

        request(
          'GET',
          '/users/' + defaultUser + '/scavs/' + data.name,
          null, successCallback, failureCallback, false, true
        );
      },

      verifyScavItemFound: function(data, successCallback, failureCallback) {

        Debug.log('ServicesManager > verifyScavItemFound: scavItemId:', data.scavItemId);

        request(
          "PUT",
          '/users/' + defaultUser + '/scavs/' + data.scavMongoId + '/items/' + data.scavItemId,
          JSON.stringify({
            scavItemName: data.scavItemName,
            heading: data.heading,
            coordinates: {
              latitude: data.latitude,
              longitude: data.longitude },
            altitude: data.altitude,
            altitudeAccuracy: data.altitudeAccuracy,
            accuracy: data.accuracy
          }),
          successCallback,
          failureCallback,
          true,
          true
        );
      },

      /* ===========================================
       NATIVE IMPLEMENTATION OF THE PICTURE-TAKING
       PORTION OF THE CAMERA VIEW - Web Service Call
       Begin
       =========================================== */
      verifyScavFoundWithNativeView: function(data, successCallback, failureCallback)
      {
        Debug.log('ServicesManager > verifyScavItemFound: scavItemId:', data.selectedScavItemId);

        request(
          "PUT",
          '/native/users/' + defaultUser + '/scavs/' + data.scavMongoId + '/items/' + data.scavItemId,
          JSON.stringify({
            scavItemName: data.scavItemName,
            thumbnail: data.thumbnail,
            thumbnailType: data.thumbnailType
          }),
          successCallback,
          failureCallback,
          true,
          true
        );
      },
      /* ===========================================
       NATIVE IMPLEMENTATION OF THE PICTURE-TAKING
       PORTION OF THE CAMERA VIEW - Web Service Call
       End
       =========================================== */

      saveScavItemPictureTakenByPlayer: function(data, successCallback, failureCallback)
      {
        request(
          "POST",
          "/users/" + data.userName + "/scavs/" + data.scavName + "/items/tocameraroll",
          JSON.stringify({
            imgUrl: data.imgUrl,
            scavItemId: data.scavItemId
          }),
          successCallback,
          failureCallback,
          true,
          true
        );
      }
    };

    return _servicesManager;
  }
);