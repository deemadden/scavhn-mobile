define(

  [ 'mediator/RouteStore',
    'utils/Debug'],

  function (RouteStore, Debug)
  {
    describe("RouteStore Unit Tests", function() {

      var routeStore = new RouteStore({ router: { route: function(){} }, callback: function(){} });

      it("Should have an route entry for the HomeScreenView", function() {

        sinon.stub(routeStore, "addRoute");

        routeStore.createRoutes();

        expect(routeStore.addRoute.callCount).toEqual(3);

        expect(routeStore.addRoute.firstCall.args[0]).toEqual('home');
        expect(routeStore.addRoute.firstCall.args[1]).toEqual('homeScreen');
        expect(routeStore.addRoute.firstCall.args[2]).toEqual('views/HomeScreenView');
        expect(routeStore.addRoute.firstCall.args[3]).toEqual('viewmodels/HomeScreenViewModel');

      });

    });
  }
);

