define(

  [ 'App',
    'utils/Debug',
    'services/ServicesManager' ],

function (App, Debug, ServicesManager)
{
	describe("ServicesManager Unit Tests", function () {

    var jsonResponse = [{
        "name": "vulture",
        "level": "Beginner",
        "description": "Test",
        "duration": "04:30:00",
        "image": "vulture-44-small",
        "imageType": "PNG",
        "thumbnail": "scavhn-headsup-vulture",
        "thumbnailType": "PNG",
        "items": []
      },
      {"name" : "owl",
        "level" : "Intermediate",
        "description" : "Test2",
        "duration" : "03:00:00",
        "image" : "owl-44-small",
        "imageType" : "PNG",
        "thumbnail" : "scavhn-headsup-owl",
        "thumbnailType" : "PNG",
        "items" : []
      },
      {
        "name": "raccoon",
        "level": "Expert",
        "description": "Test3",
        "duration": "02:30:00",
        "image": "raccoon-44-small",
        "imageType": "PNG",
        "thumbnail": "scavhn-headsup-raccoon",
        "thumbnailType": "PNG",
        "items": []
      }];

    // SinonJS 1.8.1 hack to account for issue when
    // using fakeServer with PhantomJS
    beforeEach(function() {
      if (navigator.userAgent.indexOf('PhantomJS') !== -1) {

        window.ProgressEvent = function (type, params) {
          params = params || {};

          this.lengthComputable = params.lengthComputable || false;
          this.loaded = params.loaded || 0;
          this.total = params.total || 0;
        };
      }
    });

    it("Should have a getScavs method", function() {
      expect(ServicesManager.getScavs).toBeDefined();

      var getScavMethodArgs = TestHelper.getMethodArguments(ServicesManager.getScavs);

      expect(getScavMethodArgs.length).toBe(2);
      expect(getScavMethodArgs).toEqual(['successCallback', 'failureCallback']);
    });

		it("Should be able to get Scavs", function() {
			var spyShowLoadIndicator;
			var spyHideLoadIndicator;
			var stubAppGetInstance;
			var fakeServer;
			var spySuccess;
			var spyError;

			spyShowLoadIndicator = sinon.spy();
			spyHideLoadIndicator = sinon.spy();

			var objDep = {
				showLoadIndicator: spyShowLoadIndicator,
				hideLoadIndicator: spyHideLoadIndicator
			};

			var objInstance = {
				getDep: function () { return objDep; }
			};

			stubAppGetInstance = sinon.stub(App, "getInstance");
			stubAppGetInstance.returns(objInstance);
			fakeServer = sinon.fakeServer.create({});

			var responseText = JSON.stringify(jsonResponse);

      fakeServer.respondWith('GET', /.*\/scavs\?/, [200, { 'Content-Type': 'application/json', 'Content-Length': responseText.length }, responseText]);

      spySuccess = sinon.spy();
			spyError = sinon.spy();

      ServicesManager.getScavs(spySuccess, spyError);

      fakeServer.respond();

      expect(spyShowLoadIndicator.calledOnce).toBeTruthy();
      expect(spyHideLoadIndicator.calledOnce).toBeTruthy();
			expect(spySuccess.calledOnce).toBeTruthy();
			expect(spySuccess.calledWith(jsonResponse)).toBeTruthy();

      stubAppGetInstance.restore();
			fakeServer.restore();
		});
	});
});