define(

  [ 'App',
    'viewmodels/HomeScreenViewModel',
    'views/BaseView',
    'text!partials/home-screen.html',
    'views/HomeScreenView',
    'utils/Debug' ],

  function (App, HomeScreenViewModel, BaseView, template, HomeScreenView, Debug)
  {

    var homeScreenView = new HomeScreenView({ viewmodel: HomeScreenViewModel, el: {} });

    var mockTapEvent = { preventDefault: function(){}, currentTarget: function(){} };
    var jQueryDataMethodCallArgsIndex = 0;
    var jQueryDataMethodCallFirstArgument = 0;

    //beforeEach(function() {
    //});

    //afterEach(function() {
    //});

    describe("HomeScreenView Unit Tests", function() {

      it("Should have a standard set of accessors and click event bindings needed for the scav and begin buttons", function() {

        expect(homeScreenView.cachedTemplate).toBeDefined();
        expect(homeScreenView.scavCollection).toBeDefined();

        expect(homeScreenView.events['click .scav-level-items a']).toBeDefined();
        expect(homeScreenView.events['click .scav-level-items a'].valueOf()).toEqual('selectScavClick');

        expect(homeScreenView.events['click .begin-scav-action a']).toBeDefined();
        expect(homeScreenView.events['click .begin-scav-action a'].valueOf()).toEqual('beginScavClick');

      });

      it("Should set incoming HomeScreenViewModel.viewData() data to a property", function() {

        sinon.stub(homeScreenView, "render");

        homeScreenView.activate(TestHelper.getViewDataForHomeScreenView());

        expect(homeScreenView.scavCollection).toEqual(TestHelper.getViewDataForHomeScreenView().scavViewData);
        expect(homeScreenView.render.calledOnce).toBeTruthy();

        homeScreenView.render.restore();
      });

      it("Should unbind all click events when navigating away from view", function(){

        sinon.stub(homeScreenView, "undelegateEvents");

        homeScreenView.deactivate();

        expect(homeScreenView.undelegateEvents.calledOnce).toBeTruthy();

        homeScreenView.undelegateEvents.restore();

      });

      it("Should inject the partial into the parent view, initialized the scav's highlighted state, and bind all click events at render time", function() {

        // Asserting first that there is a method for the click event
        expect(homeScreenView.resetHighlightedScavItems).toBeDefined();

        if(homeScreenView.resetHighlightedScavItems)
        {
          sinon.stub(homeScreenView.$el, "html");
          sinon.spy(homeScreenView, "cachedTemplate");
          sinon.stub(homeScreenView, "resetHighlightedScavItems");
          sinon.stub(homeScreenView, "delegateEvents");

          homeScreenView.render();

          expect(homeScreenView.$el.html.calledOnce).toBeTruthy();
          expect(homeScreenView.$el.html.args.length).toEqual(1);

          expect(homeScreenView.cachedTemplate.calledOnce).toBeTruthy();
          expect(homeScreenView.cachedTemplate.args.length).toEqual(1);

          expect(homeScreenView.resetHighlightedScavItems.calledOnce).toBeTruthy();
          expect(homeScreenView.delegateEvents.calledOnce).toBeTruthy();

        }

        homeScreenView.$el.html.restore();
        homeScreenView.cachedTemplate.restore();
        homeScreenView.resetHighlightedScavItems.restore();
        homeScreenView.delegateEvents.restore();

      });

      it("Should be able to capture and store a scav collection for later use", function() {

        sinon.stub(homeScreenView, "resetHighlightedScavItems");
        sinon.stub(homeScreenView, "highlightSelectedItem");
        sinon.stub(homeScreenView, "updateBeginButtonState");
        sinon.stub(homeScreenView, "trigger");

        // jQuery itself is a function, so we have to stub it in order to
        // short circuit and watch it
        $ = sinon.stub();
        $.withArgs(mockTapEvent.currentTarget).returns(sinon.stub({ data: function(){} }));


        homeScreenView.selectScavClick(mockTapEvent);


        expect(homeScreenView.resetHighlightedScavItems.calledOnce).toBeTruthy();
        expect(homeScreenView.highlightSelectedItem.calledOnce).toBeTruthy();
        expect(homeScreenView.updateBeginButtonState.calledOnce).toBeTruthy();

        // .trigger call assertions
        expect(homeScreenView.trigger.calledOnce).toBeTruthy();
        expect(homeScreenView.trigger.args[jQueryDataMethodCallArgsIndex][jQueryDataMethodCallFirstArgument]).toEqual('scav-selected:click');
        expect($.calledOnce).toBeTruthy();
        expect($.calledWith(mockTapEvent.currentTarget)).toBeTruthy();

        homeScreenView.resetHighlightedScavItems.restore();
        homeScreenView.highlightSelectedItem.restore();
        homeScreenView.updateBeginButtonState.restore();
        homeScreenView.trigger.restore();
        sinon.restore($);

      });

      it("Should be able to begin a scavenger hunt once a scav is selected", function() {

        sinon.stub(homeScreenView, "isBeginButtonDisabled");
        homeScreenView.isBeginButtonDisabled.returns(false);

        sinon.stub(homeScreenView, "trigger");


        homeScreenView.beginScavClick(mockTapEvent);


        expect(homeScreenView.trigger.calledOnce).toBeTruthy();
        expect(homeScreenView.trigger.args.length).toEqual(1);
        expect(homeScreenView.trigger.args[jQueryDataMethodCallArgsIndex][jQueryDataMethodCallFirstArgument]).toEqual('begin-scav:click');

        homeScreenView.trigger.restore();
        homeScreenView.isBeginButtonDisabled.restore();

      });

      it("Should have a disabled begin button if a scav hasn't been selected yet", function() {

        sinon.stub(homeScreenView, "isBeginButtonDisabled");
        homeScreenView.isBeginButtonDisabled.returns(true);

        sinon.stub(homeScreenView, "trigger");


        homeScreenView.beginScavClick(mockTapEvent);


        expect(homeScreenView.trigger.calledOnce).toBeFalsy();

        homeScreenView.trigger.restore();
        homeScreenView.isBeginButtonDisabled.restore();

      });

    });

  }
);