'use strict';

(function () {
  window.map = {
    render: function () {
      showMap();
      window.data.getOffers();
    },

    mapBlock: document.querySelector('.map')
  };

  window.form.disable();
  if (!window.map.mapBlock.classList.contains('map--faded')) {
    window.map.mapBlock.classList.add('map--faded');
  }

  function showMap() {
    window.map.mapBlock.classList.remove('map--faded');
  }
}());
