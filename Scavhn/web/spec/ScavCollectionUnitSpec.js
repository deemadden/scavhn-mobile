define(

  [ 'models/Scav',
    'models/ScavCollection',
    'utils/Debug' ],

  function(Scav, ScavCollection, Debug)
  {
    var scavCollection;

    describe("ScavCollection Unit Tests", function() {

      beforeEach(function() {
        scavCollection = new ScavCollection();
      });

      it("Should have a model override and a comparator definition", function() {

        expect(scavCollection.model).toBeDefined();
        expect(scavCollection.comparator).toBeDefined();

        // Asserting that the model is a Scav type
        scavCollection.add(TestHelper.getScavDataForTest()[0]);

        expect(scavCollection.at(0) instanceof Scav).toBeTruthy();

      });

      it("Should sort the collection by name", function() {

        var scavForComparator = new Scav(TestHelper.getScavDataForTest()[0]);
        var expectedComparatorField = 'vulture';

        var actualComparatorField = scavCollection.comparator(scavForComparator);

        expect(actualComparatorField).toEqual(expectedComparatorField);

      });

    });
  }
);