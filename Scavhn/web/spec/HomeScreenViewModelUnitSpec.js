define(

  [ 'App',
    'views/HomeScreenView',
    'viewmodels/HomeScreenViewModel',
    'services/ServicesAdapter',
    'mediator/RouteMediator',
    'models/Scav',
    'models/ScavCollection',
    'helpers/CSSHelper',
    'utils/Debug' ],

  function (App, HomeScreenView, HomeScreenViewModel, ServicesAdapter, RouteMediator, Scav, ScavCollection, CSSHelper, Debug)
  {

    describe("HomeScreenViewModel Unit Tests", function() {

      var stubAppGetInstance;
      var homeScreenViewModelBindObserversSpy;
      var homeScreenViewModelUnbindObserversSpy;
      var homeScreenViewDeactivateStub;
      var homeScreenViewActivateStub;
      var homeScreenViewOnStub;
      var homeScreenViewOffStub;
      var servicesAdapterGetScavsStub;
      var servicesAdapterGetCurrentHTML5GeolocationPositionStub;
      var servicesAdapterOnStub;
      var servicesAdapterOffStub;
      var cssHelperGetBackgroundUrlPathForAnchorSpy;

      // Setup / Teardown
      beforeEach(function() {

        var registerDepStub = {
          registerDep: function () { }
        };

        stubAppGetInstance = sinon.stub(App, "getInstance");
        stubAppGetInstance.returns(registerDepStub);

        servicesAdapterGetScavsStub =  sinon.stub(ServicesAdapter, "getScavs");
        servicesAdapterGetCurrentHTML5GeolocationPositionStub = sinon.stub(ServicesAdapter, "getCurrentHTML5GeolocationPosition");
        servicesAdapterOnStub = sinon.stub(ServicesAdapter, "on");
        servicesAdapterOffStub = sinon.stub(ServicesAdapter, "off");


        var view = new HomeScreenView({
          viewmodel: HomeScreenViewModel,
          el: {}
        });

        HomeScreenViewModel.set('view', view);

        homeScreenViewOnStub = sinon.stub(HomeScreenViewModel.get('view'), "on");
        homeScreenViewOffStub = sinon.stub(HomeScreenViewModel.get('view'), "off");

        homeScreenViewModelBindObserversSpy = sinon.spy(HomeScreenViewModel, "bindObservers");
        homeScreenViewModelUnbindObserversSpy = sinon.spy(HomeScreenViewModel, "unbindObservers");

        cssHelperGetBackgroundUrlPathForAnchorSpy = sinon.spy(CSSHelper, "getBackgroundURLPathForAnchor");

        homeScreenViewDeactivateStub = sinon.stub(view, "deactivate");
        homeScreenViewActivateStub = sinon.stub(view, "activate");

        ServicesAdapter.set('scavs', new ScavCollection(TestHelper.getScavDataForTest()), { silent: true });
        ServicesAdapter.set('currentScavId', null);
      });

      afterEach(function() {
        homeScreenViewOnStub.restore();
        homeScreenViewOffStub.restore();
        homeScreenViewDeactivateStub.restore();
        homeScreenViewActivateStub.restore();
        homeScreenViewModelBindObserversSpy.restore();
        homeScreenViewModelUnbindObserversSpy.restore();
        cssHelperGetBackgroundUrlPathForAnchorSpy.restore();
        servicesAdapterGetScavsStub.restore();
        servicesAdapterGetCurrentHTML5GeolocationPositionStub.restore();
        servicesAdapterOnStub.restore();
        servicesAdapterOffStub.restore();
        stubAppGetInstance.restore();

        ServicesAdapter.set('scavs', null);
      });

      // Tests
      it("Should setup data and callback bindings through activateWithData when RouteMediator loads the viewmodel", function() {

        HomeScreenViewModel.activateWithData();

        expect(homeScreenViewModelBindObserversSpy.calledOnce).toBeTruthy();

        // Calls within .bindObservers()
        expect(homeScreenViewOnStub.calledTwice).toBeTruthy();
        expect(homeScreenViewOnStub.firstCall.calledWith('begin-scav:click', HomeScreenViewModel.beginScav, HomeScreenViewModel)).toBeTruthy();
        expect(homeScreenViewOnStub.secondCall.calledWith('scav-selected:click', HomeScreenViewModel.setCurrentScav, HomeScreenViewModel)).toBeTruthy();

        expect(servicesAdapterOnStub.callCount).toBe(4);
        expect(servicesAdapterOnStub.firstCall.calledWith('getScavs:success', HomeScreenViewModel.getScavsSuccess, HomeScreenViewModel)).toBeTruthy();
        expect(servicesAdapterOnStub.secondCall.calledWith('getScavs:failure', HomeScreenViewModel.getScavsFailure, HomeScreenViewModel)).toBeTruthy();
        expect(servicesAdapterOnStub.thirdCall.calledWith('getCurrentHTML5GeolocationPosition:success', HomeScreenViewModel.getPositionSuccess, HomeScreenViewModel)).toBeTruthy();
        expect(servicesAdapterOnStub.lastCall.calledWith('getCurrentHTML5GeolocationPosition:failure', HomeScreenViewModel.getPositionFailure, HomeScreenViewModel)).toBeTruthy();

        // Work that occurs after .bindObservers() in .activateWithData()
        expect(ServicesAdapter.getScavs.calledOnce).toBeTruthy();

      });

      it("Should unbind itself from all events and callbacks and unload the view when navigating away from Home screen", function() {

        HomeScreenViewModel.deactivate();

        expect(homeScreenViewModelUnbindObserversSpy.calledOnce).toBeTruthy();

        // Calls within .unbindObservers();
        expect(homeScreenViewOffStub.calledTwice).toBeTruthy();
        expect(homeScreenViewOffStub.firstCall.calledWith('begin-scav:click', HomeScreenViewModel.beginScav, HomeScreenViewModel)).toBeTruthy();
        expect(homeScreenViewOffStub.secondCall.calledWith('scav-selected:click', HomeScreenViewModel.setCurrentScav, HomeScreenViewModel)).toBeTruthy();

        expect(servicesAdapterOffStub.callCount).toBe(4);
        expect(servicesAdapterOffStub.firstCall.calledWith('getScavs:success', HomeScreenViewModel.getScavsSuccess, HomeScreenViewModel)).toBeTruthy();
        expect(servicesAdapterOffStub.secondCall.calledWith('getScavs:failure', HomeScreenViewModel.getScavsFailure, HomeScreenViewModel)).toBeTruthy();
        expect(servicesAdapterOffStub.thirdCall.calledWith('getCurrentHTML5GeolocationPosition:success', HomeScreenViewModel.getPositionSuccess, HomeScreenViewModel)).toBeTruthy();
        expect(servicesAdapterOffStub.lastCall.calledWith('getCurrentHTML5GeolocationPosition:failure', HomeScreenViewModel.getPositionFailure, HomeScreenViewModel)).toBeTruthy();


        // Work that occurs after .unbindObservers() in .deactivate()
        expect(homeScreenViewDeactivateStub.calledOnce).toBeTruthy();
        expect(HomeScreenViewModel.get('view')).toBe(null);

      });

      it("Should build a view data package with only the data the view needs to display", function() {

        var expectedViewData = TestHelper.getViewDataForHomeScreenView();

        var actualViewData = HomeScreenViewModel.viewData();

        expect(cssHelperGetBackgroundUrlPathForAnchorSpy.calledThrice).toBeTruthy();
        expect(actualViewData).toEqual(expectedViewData);

      });

      it("Should make an HTML5 geolocation call when web service call comes back successfully", function() {

        HomeScreenViewModel.getScavsSuccess();

        expect(servicesAdapterGetCurrentHTML5GeolocationPositionStub.calledOnce).toBeTruthy();

      });

      it("Should activate the HomeScreenView with data when the geolocation check comes back successfully", function() {

        var expectedViewDataForHomeScreenView = TestHelper.getViewDataForHomeScreenView();

        HomeScreenViewModel.getPositionSuccess();

        expect(homeScreenViewActivateStub.calledWith(expectedViewDataForHomeScreenView)).toBeTruthy();
      });

      it("Should log an error message to the console if the web service call fails", function() {

        var expectedXhr = { xhr: 'mockXhrObject' };
        var expectedStatus = 404;
        var expectedErrorHolder = 'error';

        sinon.spy(Debug, "log");

        HomeScreenViewModel.getScavsFailure(expectedXhr, expectedStatus, expectedErrorHolder);

        expect(Debug.log.calledOnce).toBeTruthy();

        // The Arguments for Debug log resolve to a single array object,
        // which is why the assert has to do .args[0] to get the expected
        // number of arguments the test expects
        expect(Debug.log.args[0].length).toBe(4);
        expect(Debug.log.args[0][1]).toEqual(expectedXhr);
        expect(Debug.log.args[0][2]).toEqual(expectedStatus);
        expect(Debug.log.args[0][3]).toEqual(expectedErrorHolder);


        Debug.log.restore();

      });

      // Tests for Tap / Click events in the HomeScreenView
      it("Should set the current Scav when a Scav is Selected in the HomeScreenView", function() {

       expect(HomeScreenViewModel.setCurrentScav).toBeDefined();

       var expectedSelectedScavId = _.findWhere(TestHelper.getScavDataForTest(), { name: "vulture" }).id;

       if(HomeScreenViewModel.setCurrentScav)
         HomeScreenViewModel.setCurrentScav(expectedSelectedScavId);

       var actualSelectedScavId = ServicesAdapter.get('currentScavId');

       expect(actualSelectedScavId).toEqual(expectedSelectedScavId);

      });

      it("Should navigate into the ScavItems View when the Begin button is clicked", function() {

       expect(HomeScreenViewModel.beginScav).toBeDefined();

       var selectedScavJson = _.findWhere(TestHelper.getScavDataForTest(), { name: "vulture" });
       var expectedSelectedScavId = selectedScavJson._id;
       ServicesAdapter.set('currentScavId', expectedSelectedScavId);

       sinon.stub(RouteMediator, "navigateTo");

       if(HomeScreenViewModel.beginScav)
          HomeScreenViewModel.beginScav();

       var actualSelectedScav = ServicesAdapter.get('selectedScav');

       // The following should have happened in this method
       expect(expectedSelectedScavId).toEqual(actualSelectedScav.get('_id'));
       expect(RouteMediator.navigateTo.calledOnce).toBeTruthy();

       RouteMediator.navigateTo.restore();

      });

    });
  }
);