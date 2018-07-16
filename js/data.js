'use strict';
(function () {
  window.data = {
    getOffers: function () {
      return generateOffers();
    },

    offerTypes: {
      palace: {
        minPrice: '10000',
        text: 'Дворец'
      },
      flat: {
        minPrice: '1000',
        text: 'Квартира'
      },
      house: {
        minPrice: '5000',
        text: 'Дом'
      },
      bungalo: {
        minPrice: '0',
        text: 'Бунгало'
      }
    },

    template: document.querySelector('template')
  };

  var offers = [];
  var MAX_OFFERS = 8;
  var offerTitles = [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ];
  var MIN_X = 300;
  var MAX_X = 900;
  var MIN_Y = 130;
  var MAX_Y = 630;
  var photos = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];
  var MAX_PRICE = 1000000;
  var MIN_PRICE = 1000;
  var MIN_ROOMS = 1;
  var MAX_ROOMS = 5;
  var MIN_GUESTS = 0;
  var MAX_GUESTS = 5;
  var checkinTimes = ['12:00', '13:00', '14:00'];
  var checkoutTimes = ['12:00', '13:00', '14:00'];
  var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

  function generateOffers() {
    var position = {};

    window.library.shuffleArray(offerTitles);

    for (var i = 0; i < MAX_OFFERS; i++) {
      position = {
        x: window.library.getRandomInt(MIN_X, MAX_X),
        y: window.library.getRandomInt(MIN_Y, MAX_Y)
      };

      window.library.shuffleArray(photos);
      addOffer(i, position, photos);
    }
    return offers;
  }

  function addOffer(index, position, pictures) {
    offers.push({
      author: {
        avatar: 'img/avatars/user0' + (index + 1) + '.png'
      },

      offer: {
        title: offerTitles[index],
        address: position.x + ', ' + position.y,
        price: window.library.getRandomInt(MIN_PRICE, MAX_PRICE),
        type: window.library.getRandomKey(window.data.offerTypes),
        rooms: window.library.getRandomInt(MIN_ROOMS, MAX_ROOMS),
        guests: window.library.getRandomInt(MIN_GUESTS, MAX_GUESTS),
        checkin: window.library.getRandomValue(checkinTimes),
        checkout: window.library.getRandomValue(checkoutTimes),
        features: window.library.getRandomArray(features),
        description: '',
        photos: pictures.slice()
      },

      location: {
        x: position.x,
        y: position.y
      }
    });
  }
})();
