define(

  'models/ScavCollection',

  [ 'models/Scav' ],

  function(Scav)
  {
    return Backbone.Collection.extend({

      model: Scav,

      comparator: function(scav)
      {
        return scav.get('name');
      }
    });
  }
);