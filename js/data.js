'use strict';

(function () {
  window.data = {
    ESC_KEYCODE: 27,
    ENTER_KEYCODE: 13,

    getOffers: function () {
      generateOffers();
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

  function generateOffers() {
    window.backend.load(function (arr) {
      window.pin.render(arr);
    }, window.modal.error);
  }
})();
