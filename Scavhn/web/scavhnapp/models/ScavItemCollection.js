define(

  'models/ScavItemCollection',

  [ 'models/ScavItem' ],

  function(ScavItem)
  {
    return Backbone.Collection.extend({

      model: ScavItem,

      comparator: function(scavItem)
      {
        return scavItem.get('itemName');
      }
    });
  }
);