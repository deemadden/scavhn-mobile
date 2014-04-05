define(

  [ 'App',
    'viewmodels/ScavItemsViewModel',
    'services/ServicesAdapter',
    'models/Scav',
    'helpers/CSSHelper',
    'utils/Debug' ],

  function (App, ScavItemsViewModel, ServicesAdapter, Scav, CSSHelper, Debug)
  {
    describe("ScavItemViewModel unit tests", function() {

      // Setup before each test
      beforeEach(function() {
        var vultureScav = new Scav(TestHelper.getVultureScavWithNoItemsForTest());
        vultureScav.setScavItems(TestHelper.getScavItemsDataForTest().items);

        ServicesAdapter.set('selectedScav', vultureScav);
        ServicesAdapter.set('isDeviceRunningIOS7', true);

        sinon.spy(CSSHelper, "getBackgroundURLPathForAnchor");
      });

      // Teardown after each test
      afterEach(function() {
        ServicesAdapter.set('selectedScav', null);
        ServicesAdapter.set('isDeviceRunningIOS7', false);

        CSSHelper.getBackgroundURLPathForAnchor.restore();
      });

      // TESTS
      it("Should build a view data package with only the data the view needs to display", function() {

        givenAViewDataCallAtActivateTime();
        whenViewDataIsCalled();
        thenDataNeededByViewIsReturned();

      });

    });

    function givenAViewDataCallAtActivateTime()
    {
      expectedViewData = getExpectedViewData();
    }

    function whenViewDataIsCalled()
    {
      actualViewData = ScavItemsViewModel.viewData();
    }

    function thenDataNeededByViewIsReturned()
    {
      expect(JSON.stringify(actualViewData)).toEqual(JSON.stringify(expectedViewData));

      expect(CSSHelper.getBackgroundURLPathForAnchor.callCount).toBe(21);
      expect(CSSHelper.getBackgroundURLPathForAnchor.firstCall.args[0]).toBe('scavitemsscreen');
      expect(CSSHelper.getBackgroundURLPathForAnchor.secondCall.args[0]).toBe('scavitemsscreen/itemstofind');
      expect(CSSHelper.getBackgroundURLPathForAnchor.lastCall.args[0]).toBe('scavitemsscreen/itemstofind');
    }

    // Global vars
    var expectedViewData;
    var actualViewData;

    //Helpers
    function getExpectedViewData() {
      return {
        isDeviceRunningIOS7: true,
        scavId: '52f6d7f845617474b8fd4308',
        scavName: 'vulture',
        scavItems: [{
          id: '52f6d7f845617474b8fd430b',
          imageURLSm: 'background: url(\'resources/img/scavitemsscreen/itemstofind/shoes-sm.png\') center center no-repeat;',
          imageURLLg: 'background: url(\'resources/img/scavitemsscreen/itemstofind/shoes-lg.png\') center center no-repeat;',
          name: 'Old Shoe',
          points: '6',
          hint: 'You will find the item you see...',
          fullHint: 'You will find the item you seek in a car or under a creek'
        },
          {
            id: '52f6d7f845617474b8fd430c',
            imageURLSm: 'background: url(\'resources/img/scavitemsscreen/itemstofind/watch-sm.png\') center center no-repeat;',
            imageURLLg: 'background: url(\'resources/img/scavitemsscreen/itemstofind/watch-lg.png\') center center no-repeat;',
            name: 'Pocket Watch',
            points: '3',
            hint: 'You will find this watch on a ...',
            fullHint: 'You will find this watch on a fence, or in dire need to repent'
          },
          {
            id: '52f6d7f845617474b8fd430d',
            imageURLSm: 'background: url(\'resources/img/scavitemsscreen/itemstofind/typewriter-sm.png\') center center no-repeat;',
            imageURLLg: 'background: url(\'resources/img/scavitemsscreen/itemstofind/typewriter-lg.png\') center center no-repeat;',
            name: 'Typewriter',
            points: '2',
            hint: 'Look to the West, young one!',
            fullHint: 'Look to the West, young one!'
          },
          {
            id: '52f6d7f845617474b8fd430e',
            imageURLSm: 'background: url(\'resources/img/scavitemsscreen/itemstofind/toothbrushes-sm.png\') center center no-repeat;',
            imageURLLg: 'background: url(\'resources/img/scavitemsscreen/itemstofind/toothbrushes-lg.png\') center center no-repeat;',
            name: 'Cup of toothbrushes',
            points: '5',
            hint: 'It is under your nose',
            fullHint: 'It is under your nose'
          },
          {
            id: '52f6d7f845617474b8fd430f',
            imageURLSm: 'background: url(\'resources/img/scavitemsscreen/itemstofind/sock-sm.png\') center center no-repeat;',
            imageURLLg: 'background: url(\'resources/img/scavitemsscreen/itemstofind/sock-lg.png\') center center no-repeat;',
            name: 'Sweat sock',
            points: '1',
            hint: 'Not a Cuckoo clock, but a Cuck...',
            fullHint: 'Not a Cuckoo clock, but a Cuckoo Nest'
          },
          {
            id: '52f6d7f845617474b8fd4310',
            imageURLSm: 'background: url(\'resources/img/scavitemsscreen/itemstofind/necklace-sm.png\') center center no-repeat;',
            imageURLLg: 'background: url(\'resources/img/scavitemsscreen/itemstofind/necklace-lg.png\') center center no-repeat;',
            name: 'Silver Necklace',
            points: '6',
            hint: 'Standing on the edge of the un...',
            fullHint: 'Standing on the edge of the universe'
          },
          {
            id: '52f6d7f845617474b8fd4311',
            imageURLSm: 'background: url(\'resources/img/scavitemsscreen/itemstofind/lego-sm.png\') center center no-repeat;',
            imageURLLg: 'background: url(\'resources/img/scavitemsscreen/itemstofind/lego-lg.png\') center center no-repeat;',
            name: 'Lego House',
            points: '2',
            hint: 'Next to her cheating heart',
            fullHint: 'Next to her cheating heart'
          },
          {
            id: '52f6d7f845617474b8fd4312',
            imageURLSm: 'background: url(\'resources/img/scavitemsscreen/itemstofind/ribbon-sm.png\') center center no-repeat;',
            imageURLLg: 'background: url(\'resources/img/scavitemsscreen/itemstofind/ribbon-lg.png\') center center no-repeat;',
            name: 'Ribbon',
            points: '1',
            hint: 'It is leaving on a jet plane',
            fullHint: 'It is leaving on a jet plane'
          },
          {
            id: '52f6d7f845617474b8fd4313',
            imageURLSm: 'background: url(\'resources/img/scavitemsscreen/itemstofind/remote-sm.png\') center center no-repeat;',
            imageURLLg: 'background: url(\'resources/img/scavitemsscreen/itemstofind/remote-lg.png\') center center no-repeat;',
            name: 'TV Remote',
            points: '5',
            hint: 'Look no farther than Cobra',
            fullHint: 'Look no farther than Cobra'
          },
          {
            id: '52f6d7f845617474b8fd4314',
            imageURLSm: 'background: url(\'resources/img/scavitemsscreen/itemstofind/pen-sm.png\') center center no-repeat;',
            imageURLLg: 'background: url(\'resources/img/scavitemsscreen/itemstofind/pen-lg.png\') center center no-repeat;',
            name: 'Ballpoint Pen',
            points: '3',
            hint: 'You will find it where parkers...',
            fullHint: 'You will find it where parkers like to park and breakers like to break'
          }],
        recentItem: 'No recent item',
        pointTotal: 0,
        duration: '04:30:00',
        expiryDate: null,
        scavItemsFound: 0,
        scavItemsLeft: 10,
        thumbnailImageURL: 'background-color: #ffffff; background-image: url(\'resources/img/scavitemsscreen/scavhn-headsup-vulture.png\'); background-position: center center; background-repeat: no-repeat',
        buildHref: ScavItemsViewModel.getBuildHref
      }
    }


//    function getExpectedViewData() {
//      return {
//        isDeviceRunningIOS7: false,
//        scavId: '5078ad1ada061b6ff15ca90f',
//        scavName: 'vulture',
//        scavTimeLength: '04:30:00',
//        scavItems: [
//          {
//            id: '5b46a072e6664f818e076c0a',
//            imageURL: 'background: url(\'resources/img/scavitemsscreen/itemstofind/pen-sm.png\') center center no-repeat;',
//            name: 'Ballpoint Pen',
//            points: '3',
//            hint: 'You will find it where parkers...'
//          },
//          {
//            id: '5644384292b1445aa9f0cc10',
//            imageURL: 'background: url(\'resources/img/scavitemsscreen/itemstofind/toothbrushes-sm.png\') center center no-repeat;',
//            name: 'Cup of toothbrushes',
//            points: '5',
//            hint: 'It is under your nose'
//          },
//          {
//            id: '599d10073e2f4548819f7ce5',
//            imageURL: 'background: url(\'resources/img/scavitemsscreen/itemstofind/lego-sm.png\') center center no-repeat;',
//            name: 'Lego House',
//            points: '2',
//            hint: 'Next to her cheating heart'
//          },
//          {
//            id: '5227b3b1895997fe080008a9',
//            imageURL: 'background: url(\'resources/img/scavitemsscreen/itemstofind/shoes-sm.png\') center center no-repeat;',
//            name: 'Old Shoe',
//            points: '6',
//            hint: 'You will find the item you see...'
//          },
//          {
//            id: '5dda4d2a0cd249c2a63a1f12',
//            imageURL: 'background: url(\'resources/img/scavitemsscreen/itemstofind/watch-sm.png\') center center no-repeat;',
//            name: 'Pocket Watch',
//            points: '3',
//            hint: 'You will find this watch on a ...'
//          },
//          {
//            id: '5f6de0ed7336403ea9594ef3',
//            imageURL: 'background: url(\'resources/img/scavitemsscreen/itemstofind/ribbon-sm.png\') center center no-repeat;',
//            name: 'Ribbon',
//            points: '1',
//            hint: 'It is leaving on a jet plane'
//          },
//          {
//            id: '5bcde6a92ce94f4ba285f35d',
//            imageURL: 'background: url(\'resources/img/scavitemsscreen/itemstofind/necklace-sm.png\') center center no-repeat;',
//            name: 'Silver Necklace',
//            points: '6',
//            hint: 'Standing on the edge of the un...'
//          },
//          {
//            id: '5b480bddde1a4860b6c815e8',
//            imageURL: 'background: url(\'resources/img/scavitemsscreen/itemstofind/sock-sm.png\') center center no-repeat;',
//            name: 'Sweat sock',
//            points: '1',
//            hint: 'Not a Cuckoo clock, but a Cuck...'
//          },
//          {
//            id: '5b2b2c82556e428d9367e7a1',
//            imageURL: 'background: url(\'resources/img/scavitemsscreen/itemstofind/remote-sm.png\') center center no-repeat;',
//            name: 'TV Remote',
//            points: '5',
//            hint: 'Look no farther than Cobra'
//          },
//          {
//            id: '5b8b96e9f60942c08d5d955a',
//            imageURL: 'background: url(\'resources/img/scavitemsscreen/itemstofind/typewriter-sm.png\') center center no-repeat;',
//            name: 'Typewriter',
//            points: '2',
//            hint: 'Look to the West, young one!'
//          }
//        ],
//        recentItem: 'No recent item',
//        thumbnailImageURL: 'background-color: #ffffff; background-image: url(\'resources/img/scavitemsscreen/scavhn-headsup-vulture.png\'); background-position: center center; background-repeat: no-repeat',
//        buildHref: ScavItemsViewModel.getBuildHref
//  };

  }
);
