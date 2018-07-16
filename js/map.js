'use strict';

(function () {
  window.map = {
    render: function () {
      showMap();
      window.pin.render(offers);
      window.card.render(offers[0]);
      createCardListeners();
    },

    mapBlock: document.querySelector('.map')
  };

  var offers = window.data.getOffers();

  window.form.disable();
  if (!window.map.mapBlock.classList.contains('map--faded')) {
    window.map.mapBlock.classList.add('map--faded');
  }

  function createCardListeners() {
    for (var i = 0; i < window.pin.mapPinsList.children.length; i++) {
      if (!window.pin.mapPinsList.children[i].classList.contains('map__pin--main')
      && window.pin.mapPinsList.children[i].classList.contains('map__pin')) {
        window.pin.mapPinsList.children[i].addEventListener('click', function (evt) {
          window.card.render(offers[evt.currentTarget.getAttribute('data-key')]);
        });
      }
    }
  }

  function showMap() {
    window.map.mapBlock.classList.remove('map--faded');
  }
}());
