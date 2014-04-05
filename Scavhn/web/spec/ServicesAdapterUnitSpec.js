define(

  [ 'services/ServicesManager',
    'services/ServicesAdapter',
    'utils/Debug' ],

  function (ServicesManager, ServicesAdapter, Debug)
  {
    describe("ServicesAdapter Unit Tests", function() {

      var servicesManagerGetScavsStub;

      beforeEach(function() {
        servicesManagerGetScavsStub = sinon.stub(ServicesManager, 'getScavs');
      });

      afterEach(function() {
        servicesManagerGetScavsStub.restore();
      });

      it("Should have a scavs accessor", function() {
        expect(ServicesAdapter.defaults.scavs).toBeDefined();
      });

      it("Should have a getScavs method", function() {
        expect(ServicesAdapter.getScavs).toBeDefined();
      });

      it("Should have a getScavsSuccess callback method", function() {

        expect(ServicesAdapter.getScavsSuccess).toBeDefined();

        var scavsSuccessArgs = TestHelper.getMethodArguments(ServicesAdapter.getScavsSuccess);

        expect(scavsSuccessArgs.length).toBe(1);

      });

      it("Should have a getScavsFailure callback method", function() {

        expect(ServicesAdapter.getScavsFailure).toBeDefined();

        var scavsFailureArgs = TestHelper.getMethodArguments(ServicesAdapter.getScavsFailure);

        expect(scavsFailureArgs.length).toBe(3);

      });

      it("Should have a _populateScavs implied private method (indicated by the leading underscore in name)", function() {

        expect(ServicesAdapter._populateScavs).toBeDefined();

        var populateScavsArgs = TestHelper.getMethodArguments(ServicesAdapter._populateScavs);

        expect(populateScavsArgs.length).toBe(1);

      });

      it("Should get Scavs from the ServicesManager", function() {
        ServicesAdapter.getScavs();

        expect(servicesManagerGetScavsStub.calledOnce);
      });

      it("Should cache the scavs in a ScavCollection when getScavsSuccess is called", function() {

        var expectedScavsJson = TestHelper.getScavDataForTest()[0];
        sinon.spy(ServicesAdapter, "_populateScavs");

        // .trigger() method is actually inherited from Backbone Events.
        // http://backbonejs.org/#Events-trigger
        // The only way sinonJS can spy on it is through the inherited
        // implementation.
        sinon.spy(ServicesAdapter, "trigger");

        ServicesAdapter.getScavsSuccess(expectedScavsJson);

        expect(ServicesAdapter._populateScavs.withArgs(expectedScavsJson).calledOnce).toBeTruthy();
        expect(ServicesAdapter.trigger.calledWith('getScavs:success', expectedScavsJson)).toBeTruthy();
        expect(ServicesAdapter.get('scavs').at(0).toJSON()).toEqual(expectedScavsJson);

        ServicesAdapter.trigger.restore();
        ServicesAdapter._populateScavs.restore();
      });

      it("Should trigger a failure event when getScavsFailure is called", function() {

        var mockXhr = { header: 'failure header' };
        var expectedStatus = 404;
        var expectedErrorHolder = 'error';

        sinon.spy(ServicesAdapter, "trigger");

        ServicesAdapter.getScavsFailure(mockXhr, expectedStatus, expectedErrorHolder);

        expect(ServicesAdapter.trigger.calledWith('getScavs:failure', [mockXhr, expectedStatus, expectedErrorHolder])).toBeTruthy();

        ServicesAdapter.trigger.restore();

      });

      it("Should get ScavItems from the ServicesManager", function() {
        var servicesManagerGetScavItemsForScavStub = sinon.stub(ServicesManager, "saveUserScavItemsForScav");

        ServicesAdapter.saveUserScavItemsForScav('xxxx');

        expect(servicesManagerGetScavItemsForScavStub.calledWith('xxxx'));

        servicesManagerGetScavItemsForScavStub.restore();
      });

      it("Should Get Scavs", function() {

        servicesManagerGetScavsStub.callsArgWith(0, TestHelper.getScavDataForTest());

        sinon.spy(ServicesAdapter, "getScavsSuccess");
        sinon.spy(ServicesAdapter, "getScavsFailure");

        ServicesAdapter.getScavs();

        expect(ServicesAdapter.getScavsSuccess.calledOnce).toBeTruthy();
        expect(ServicesAdapter.getScavsFailure.notCalled).toBeTruthy();

        var results = ServicesAdapter.get('scavs');

        expect(results.length).toBe(3);
        expect(results.at(0).get('name')).toBe("owl");
        expect(results.at(1).get('name')).toBe("raccoon");
        expect(results.at(2).get('name')).toBe("vulture");

        ServicesAdapter.getScavsSuccess.restore();
        ServicesAdapter.getScavsFailure.restore();
      });
    });
  }
);
