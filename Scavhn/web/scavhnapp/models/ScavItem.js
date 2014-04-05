define(

  'models/ScavItem',

  [ ],

  /**
   * ScavItem
   *
   * Stores all the information about the items to locate for a Scav game.
   *
   */
  function()
  {
    return Backbone.Model.extend({

      defaults: {
        _id: null,
        name: null,
        pointValue: null,
        pointColor: null,
        hint: null,
        level: null,
        thumbnail: null,
        thumbnailType: null,
        status: null,
        dateTimeFoundAttempt: null,
        coordinates: null
      }
    });
  }
);