/**
 * TestHelper
 *
 * Global helper methods for unit tests.
 *
 */
!function()
{
  window.TestHelper = {

    getMethodArguments: function(methodToParse)
    {
      var methodToString = methodToParse.toString();
      var argsString = methodToString.substring(methodToString.indexOf("(")+1, methodToString.indexOf(")"));
      return (argsString === "") ? [] : argsString.split(", ");
    },

    getScavDataForTest: function()
    {
      return[
        {
          "_id": "52f6d7f845617474b8fd4308",
          "description": "This is a beginner level Scav, with items that are easy to find.",
          "duration": "04:30:00",
          "image": "vulture-44-small",
          "imageType": "PNG",
          "items": [],
          "level": "Beginner",
          "name": "vulture",
          "thumbnail": "scavhn-headsup-vulture",
          "thumbnailType": "PNG",
          "scavMongoId" : null
        },
        {
          "_id": "52f6d7f845617474b8fd4309",
          "description": "This is an intermediate level Scav, with items that are a little more difficult to find.",
          "duration": "03:00:00",
          "image": "owl-44-small",
          "imageType": "PNG",
          "items": [],
          "level": "Intermediate",
          "name": "owl",
          "thumbnail": "scavhn-headsup-owl",
          "thumbnailType": "PNG",
          "scavMongoId" : null
        },
        {
          "_id": "52f6d7f845617474b8fd430a",
          "description": "This is an expert level Scav, with items that are VERY difficult to find.",
          "duration": "02:30:00",
          "image": "raccoon-44-small",
          "imageType": "PNG",
          "items": [],
          "level": "Expert",
          "name": "raccoon",
          "thumbnail": "scavhn-headsup-raccoon",
          "thumbnailType": "PNG",
          "scavMongoId" : null
        }
      ];
    },

  getVultureScavWithNoItemsForTest: function() {
    return {
      "_id": "52f6d7f845617474b8fd4308",
      "description": "This is a beginner level Scav, with items that are easy to find.",
      "duration": "04:30:00",
      "image": "vulture-44-small",
      "imageType": "PNG",
      "items": [],
      "level": "Beginner",
      "name": "vulture",
      "thumbnail": "scavhn-headsup-vulture",
      "thumbnailType": "PNG",
      "scavMongoId" : null
    }
  },

  getScavItemsDataForTest: function()
    {
      // Typical JSON returned from a scavs/[scav game] endpoint request
      return {
        "status": "INPROGRESS",
        "name": "vulture",
        "_id": "52f6e736f684708f81000003",
        "items": [
          {
            "name": "Old Shoe",
            "pointValue": "6",
            "pointColor": "green",
            "hint": "You will find the item you seek in a car or under a creek",
            "level": "Beginner",
            "thumbnail": "shoes",
            "thumbnailType": "PNG",
            "status": "ACTIVE",
            "_id": "52f6d7f845617474b8fd430b",
            "coordinates": {
              "latitude": 41.40338,
              "longitude": 2.17403
            }
          },
          {
            "name": "Pocket Watch",
            "pointValue": "3",
            "pointColor": "purple",
            "hint": "You will find this watch on a fence, or in dire need to repent",
            "level": "Beginner",
            "thumbnail": "watch",
            "thumbnailType": "PNG",
            "status": "ACTIVE",
            "_id": "52f6d7f845617474b8fd430c",
            "coordinates": {
              "latitude": 45.485229,
              "longitude": -122.648366
            }
          },
          {
            "name": "Typewriter",
            "pointValue": "2",
            "pointColor": "red",
            "hint": "Look to the West, young one!",
            "level": "Beginner",
            "thumbnail": "typewriter",
            "thumbnailType": "PNG",
            "status": "ACTIVE",
            "_id": "52f6d7f845617474b8fd430d",
            "coordinates": {
              "latitude": 45.446388,
              "longitude": -122.773293
            }
          },
          {
            "name": "Cup of toothbrushes",
            "pointValue": "5",
            "pointColor": "magenta",
            "hint": "It is under your nose",
            "level": "Beginner",
            "thumbnail": "toothbrushes",
            "thumbnailType": "PNG",
            "status": "ACTIVE",
            "_id": "52f6d7f845617474b8fd430e",
            "coordinates": {
              "latitude": 45.446388,
              "longitude": -122.773293
            }
          },
          {
            "name": "Sweat sock",
            "pointValue": "1",
            "pointColor": "blue",
            "hint": "Not a Cuckoo clock, but a Cuckoo Nest",
            "level": "Beginner",
            "thumbnail": "sock",
            "thumbnailType": "PNG",
            "status": "ACTIVE",
            "_id": "52f6d7f845617474b8fd430f",
            "coordinates": {
              "latitude": 41.40338,
              "longitude": 2.17403
            }
          },
          {
            "name": "Silver Necklace",
            "pointValue": "6",
            "pointColor": "green",
            "hint": "Standing on the edge of the universe",
            "level": "Beginner",
            "thumbnail": "necklace",
            "thumbnailType": "PNG",
            "status": "ACTIVE",
            "_id": "52f6d7f845617474b8fd4310",
            "coordinates": {
              "latitude": 45.446388,
              "longitude": -122.773293
            }
          },
          {
            "name": "Lego House",
            "pointValue": "2",
            "pointColor": "red",
            "hint": "Next to her cheating heart",
            "level": "Beginner",
            "thumbnail": "lego",
            "thumbnailType": "PNG",
            "status": "ACTIVE",
            "_id": "52f6d7f845617474b8fd4311",
            "coordinates": {
              "latitude": 41.40338,
              "longitude": 2.17403
            }
          },
          {
            "name": "Ribbon",
            "pointValue": "1",
            "pointColor": "blue",
            "hint": "It is leaving on a jet plane",
            "level": "Beginner",
            "thumbnail": "ribbon",
            "thumbnailType": "PNG",
            "status": "ACTIVE",
            "_id": "52f6d7f845617474b8fd4312",
            "coordinates": {
              "latitude": 41.40338,
              "longitude": 2.17403
            }
          },
          {
            "name": "TV Remote",
            "pointValue": "5",
            "pointColor": "magenta",
            "hint": "Look no farther than Cobra",
            "level": "Beginner",
            "thumbnail": "remote",
            "thumbnailType": "PNG",
            "status": "ACTIVE",
            "_id": "52f6d7f845617474b8fd4313",
            "coordinates": {
              "latitude": 45.485229,
              "longitude": -122.648366
            }
          },
          {
            "name": "Ballpoint Pen",
            "pointValue": "3",
            "pointColor": "purple",
            "hint": "You will find it where parkers like to park and breakers like to break",
            "level": "Beginner",
            "thumbnail": "pen",
            "thumbnailType": "PNG",
            "status": "ACTIVE",
            "_id": "52f6d7f845617474b8fd4314",
            "coordinates": {
              "latitude": 45.446388,
              "longitude": -122.773293
            }
          }
        ]
      };
    },

    getViewDataForHomeScreenView: function() {
      return {
        scavViewData: [
          {
            id: "52f6d7f845617474b8fd4309",
            name: "owl",
            level: "Intermediate",
            backgroundImageURL: "background: url('resources/img/homescreen/owl-44-small.png') top left no-repeat;"
          },
          {
            id: "52f6d7f845617474b8fd430a",
            name: "raccoon",
            level: "Expert",
            backgroundImageURL: "background: url('resources/img/homescreen/raccoon-44-small.png') top left no-repeat;"
          },
          {
            id: "52f6d7f845617474b8fd4308",
            name: "vulture",
            level: "Beginner",
            backgroundImageURL: "background: url('resources/img/homescreen/vulture-44-small.png') top left no-repeat;"
          }
        ]
      };
    }
  }
}();
