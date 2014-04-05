define(

  [ 'App',
    'utils/Debug',
    'services/ServicesManager',
    'mediator/RouteMediator' ],

  function (App, Debug, ServicesManager, RouteMediator)
  {
    var spyShowLoadIndicator;
    var spyHideLoadIndicator;
    var appGetInstanceStub;
    var successCallbackSpy;
    var failureCallbackSpy;
    var servicesManagerDependencies;
    var appGetInstanceReturnObject;
    var actualScavFields = [];
    var expectedScavFields = [];
    // Providing descriptions of the magic numbers we're using
    var callbackObjectIndex = 0;
    var responseObjectIndex = 0;
    var beginnerLevelScavIndex = 0;
    var callbackArgs;
    var servicesManagerGetBaseUrlStub;

    describe("ServicesManager Integration Tests", function() {

      // Setup / Teardown
      beforeEach(function() {
        appGetInstanceStub = sinon.stub(App, "getInstance");

        spyShowLoadIndicator = sinon.spy();
        spyHideLoadIndicator = sinon.spy();
        sinon.spy(jQuery, "ajax");

        servicesManagerDependencies = {
          showLoadIndicator: spyShowLoadIndicator,
          hideLoadIndicator: spyHideLoadIndicator,
          set: function(){},
          activateWithData: function(){}
        };

        appGetInstanceReturnObject = {
          getDep: function() {
            return servicesManagerDependencies;
          },

          registerDep: function(){},

          get: function() { return Backbone.View }
        };

        appGetInstanceStub.returns(appGetInstanceReturnObject);

        successCallbackSpy = sinon.spy();
        failureCallbackSpy = sinon.spy();

        sinon.stub(RouteMediator, "handleRoute");
      });

      afterEach(function() {
        appGetInstanceStub.restore();
        jQuery.ajax.restore();

        if(servicesManagerGetBaseUrlStub)
          servicesManagerGetBaseUrlStub.restore();

        RouteMediator.handleRoute.restore();
      });

      // Tests
      it("Should have a getScavs method", function() {

        expect(ServicesManager.getScavs).toBeDefined();

      });

      it("Should get Scavs from the backend", function() {

        givenRequestForScavsToBackend();
        whenIRequestTheScavs('expectingSuccess');

        runs(function() {

          thenIReceiveASuccessfulResponse();
          andThenIReceiveConformingScavEntitiesForBeginnerIntermediateAndExpertLevels();

        });
      });

      it("Should raise an error on failure", function() {

        givenBadRequestForScavsToBackend();
        whenIRequestTheScavs('expectingFailure');

        runs(function() {

          thenIReceiveAFailureResponse();

        });
      });
    });

    // Givens
    function givenRequestForScavsToBackend()
    {
      expectedScavFields = ['_id', 'description', 'duration', 'image', 'imageType', 'level', 'name', 'thumbnail', 'thumbnailType', 'items'];
    }

    function givenBadRequestForScavsToBackend()
    {
      servicesManagerGetBaseUrlStub = sinon.stub(ServicesManager, "getBaseUrl");
      servicesManagerGetBaseUrlStub.returns("http://janky.sftsrc.com/scavhn");
    }

    // Whens
    function whenIRequestTheScavs(callbackExpectation)
    {
      ServicesManager.getScavs(successCallbackSpy, failureCallbackSpy);

      if(callbackExpectation == 'expectingSuccess')
      {
        waitsFor(function () {
          return successCallbackSpy.callCount > 0;
        }, 'getScavs is not responding with success', 20000);
      }
      else if(callbackExpectation == 'expectingFailure')
      {
        waitsFor(function () {
          return failureCallbackSpy.callCount > 0;
        }, 'getScavs is not responding with failure', 20000);
      }
      else
      {
        throw new Error('whenIRequestTheScavs: no callbackExpectation provided.');
      }
    }

    // Thens
    function thenIReceiveASuccessfulResponse()
    {
      expect(jQuery.ajax.calledOnce).toBeTruthy();
      expect(spyShowLoadIndicator.calledOnce).toBeTruthy();
      expect(successCallbackSpy.calledOnce).toBeTruthy();
      expect(failureCallbackSpy.calledOnce).toBeFalsy();
      expect(spyHideLoadIndicator.calledOnce).toBeTruthy();
    }

    function andThenIReceiveConformingScavEntitiesForBeginnerIntermediateAndExpertLevels()
    {
      callbackArgs = successCallbackSpy.args;

      // If args contains an object, we should have a JSON response to work with
      if (callbackArgs.length == 1)
      {
        var scavsJson = callbackArgs[callbackObjectIndex][responseObjectIndex];

        expect(scavsJson).toBeDefined();
        expect(scavsJson.length).toBe(3);

        actualScavFields = _.keys(scavsJson[beginnerLevelScavIndex]);

        expect(actualScavFields).toEqual(expectedScavFields);
      }
      else if (callbackArgs[1] == "error")
      {
        // The server didn't respond.
        throw new Error("Error trying to get top level scavs info from scavs endpoint" + ServicesManager.getBaseUrl());
      }
    }

    function thenIReceiveAFailureResponse()
    {
      var failureCallbackResponse = failureCallbackSpy.args[callbackObjectIndex][responseObjectIndex];

      expect(spyShowLoadIndicator.calledOnce).toBeTruthy();
      expect(successCallbackSpy.calledOnce).toBeFalsy();
      expect(failureCallbackSpy.calledOnce).toBeTruthy();
      expect(spyHideLoadIndicator.calledOnce).toBeTruthy();

      expect(failureCallbackResponse.status).toBe(404);
      expect(failureCallbackResponse.statusText).toBe('error');
    }
  });