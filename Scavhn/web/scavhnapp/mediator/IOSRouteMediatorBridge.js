define(

  'mediator/IOSRouteMediatorBridge',

  [ 'App',
    'mediator/RouteMediator',
    'services/ServicesAdapter',
    'utils/Debug' ],

  function(App, RouteMediator, ServicesAdapter, Debug)
  {
    var mediatorBridge = {
      processIOSCommand: function(action, data)
      {
        // Get the command out of the action.  Following a command pattern
        // similar to what was done with AssortmentProductActionMixin.
        // working on the assumption that this would be used for more than
        // just a pass-through for the RouteMediator.  So a call to
        // navigate to a particular view from iOS would look something like
        // @"window.App.getInstance().getDep('mediator/IOSRouteMediatorBridge').processIOSCommand('mediatorBridgeMethod', { parameterOne: 'arg1' })";
        // ...and so on.
        Debug.log('IOSRouteMediatorBridge.processIOSRequest() - action: ', action);
        Debug.log('IOSRouteMediatorBridge.processIOSRequest() - data: ', data);

        this.action = action;
        this.data = {};

        if(data)
          this.data = $.parseJSON(data);

        this[this.action].apply(this);
      }

      // COMMAND EXAMPLES
      //callIntoServicesAdapter: function()
      //{
      //  ServicesAdapter.enterWebApp(this.data);
      //}

      //gotoSomeView: function()
      //{
      //  var action = 'ORDER_' + this.data.workspaceSendType;

      //  RouteMediator.navigateTo('orderConfirmation', {
      //    id: ServicesAdapter.currentScavId,
      //    action: action,
      //    onlineSubmission: this.data.onlineSubmission
      //  });
      //},

      //eventTriggerExample: function()
      //{
      //  SomeDependentViewModel.get('view').trigger('some:clickmethod:click');
      //},

      //getAppDependentViewModelAndCallMethodExample: function()
      //{
      //  App.getInstance().getDep('viewmodels/SomeViewModel').get('view').trigger('someviewevent:click');
      //}
    };

    return mediatorBridge;
  }
);
