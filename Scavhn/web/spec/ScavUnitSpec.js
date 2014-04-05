define(

  [ 'models/Scav',
    'models/ScavItemCollection',
    'utils/Debug' ],

  function(Scav, ScavItemCollection, Debug)
  {
    var scav;
    var scavCollection;

    describe("Scav Model Unit Tests", function() {

      beforeEach(function() {
        scav = new Scav();
      });

      it("Should have a definition that aligns with the backend and core data models", function() {
        expect(scav.defaults._id).toBeDefined();
        expect(scav.defaults.name).toBeDefined();
        expect(scav.defaults.description).toBeDefined();
        expect(scav.defaults.duration).toBeDefined();
        expect(scav.defaults.image).toBeDefined();
        expect(scav.defaults.imageType).toBeDefined();
        expect(scav.defaults.thumbnail).toBeDefined();
        expect(scav.defaults.thumbnailType).toBeDefined();
        expect(scav.defaults.items).toBeDefined();
        expect(scav.defaults.items).toBeDefined();
        expect(scav.defaults.scavMongoId).toBeDefined();
      });

      it("Should have a setScavItems setter method and a Backbone.Model.parse override", function() {

        // setScavItems method signature expectations
        expect(scav.setScavItems).toBeDefined();

        var setScavItemsArg = TestHelper.getMethodArguments(scav.setScavItems);

        expect(setScavItemsArg.length).toEqual(1);
        expect(setScavItemsArg[0]).toEqual('scavItemsJson');


        // parse method signature method expectations
        expect(scav.parse).toBeDefined();

        var parseArg = TestHelper.getMethodArguments(scav.parse);

        expect(parseArg.length).toEqual(1);

      });

      it("Should be able to unwind scavItems JSON into a Backbone Collection and set it on the scavItems accessor", function() {

        scav.setScavItems(TestHelper.getScavItemsDataForTest().items);

        expect(scav.get('items').length).toBe(10);

      });

      it("scavItems should be of type ScavItemCollection", function() {

        scav.setScavItems(TestHelper.getScavItemsDataForTest().scavItems);

        expect(scav.get('items') instanceof ScavItemCollection).toBeTruthy();

      });

      it("Should return a populated scav when scavs JSON is fed to Backbone.Model.parse() override", function() {
        // In Backboneland, parse is a reserved method (See documentation).
        // By overriding it, we're telling backbone to do something a little more
        // special than just blindly unwinding the JSON, but it is also still
        // called implicitly by Backbone when The ServicesAdapter sets it's scavs
        // accessor with incoming JSON.
        // Ultimately, this guy is responsible for turning the scavs JSON into
        // a ScavCollection when the json is set on the ServiceAdapter's scavs accessor:
        //
        // this.get('scavs').set(json);
        //
        // This test is to serve as a guide - a koan - to help guide you
        // on how your .parse() override should work when Backbone calls it.

        var expectedScavDataDestinationArgUsedForParse = TestHelper.getScavDataForTest();
        var expectedSourceArgUsedForParse = { items: new ScavItemCollection(expectedScavDataDestinationArgUsedForParse.items, { parse: true }) };

        sinon.spy(_, "extend");

        scavCollection = scav.parse(expectedScavDataDestinationArgUsedForParse);

        // Assertions that you are making use of UnderscoreJS's extend method within
        // your parse override
        expect(_.extend.calledOnce).toBeTruthy();
        expect(_.extend.calledWith(expectedScavDataDestinationArgUsedForParse, expectedSourceArgUsedForParse)).toBeTruthy();

        // And when called, we should have unwound the JSON into a
        // into an array.  In production code, the Services Adapter
        // initializes the scavs accessor as a ScavCollection, which
        // which will convert this to a Backbone Collection.
        expect(scavCollection instanceof Array).toBeTruthy();
        expect(scavCollection.length).toEqual(3);
      });

    });
  }
);