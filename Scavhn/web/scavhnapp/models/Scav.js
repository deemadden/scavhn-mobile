define(

  'models/Scav',

  [ 'models/ScavItemCollection' ],

  /**
   * Scav
   *
   * Stores all the information about a Scav (a single Scavenger Hunt game).
   *
   */
  function(ScavItemCollection)
  {
    return Backbone.Model.extend({

      defaults: {
        _id: null,
        name: null,
        level: null,
        description: null,
        duration: null,
        image: null,
        imageType: null,
        thumbnail: null,
        thumbnailType: null,
        items: null,
        scavMongoId: null
      },

      setScavItems: function(scavItemsJson)
      {
        this.set('items', new ScavItemCollection(scavItemsJson, { parse: true }));
      },

      parse: function(data)
      {
        return _.extend(data, { items: new ScavItemCollection(data.items, { parse: true }) });
      }
    });
  }
);