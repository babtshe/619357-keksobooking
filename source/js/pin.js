'use strict';

(function () {
  var PIN_AFTER_OFFSET = 16;
  var MAX_PINS = 5;
  var MIN_Y = 130;
  var MAX_Y = 630;
  var FILTER_LOW = 10000;
  var FILTER_HIGH = 50000;
  var pinsArray = [];
  var filterForm = document.querySelector('.map__filters');
  var filterBlocks = filterForm.querySelectorAll('fieldset, select');
  var mapPinTemplate;
  try {
    mapPinTemplate = window.data.template.content.querySelector('.map__pin');
  } catch (error) {
    mapPinTemplate = window.data.template.querySelector('.map__pin');
  }
  var mapPinList = document.querySelector('.map__pins');
  var pinOffsetX = Math.round(getPinSize().width / 2);
  var pinOffsetY = Math.round(getPinSize().height);
  var mapPinMain = document.querySelector('.map__pin--main');
  var mapPinMainDefaultPos = mapPinMain.style.cssText;
  var pinMainOffset = {
    x: Math.floor(mapPinMain.offsetWidth / 2),
    y: mapPinMain.offsetHeight + PIN_AFTER_OFFSET
  };
  var filterType = filterForm.querySelector('#housing-type');
  var filterPrice = filterForm.querySelector('#housing-price');
  var filterRooms = filterForm.querySelector('#housing-rooms');
  var filterGuests = filterForm.querySelector('#housing-guests');
  var filterCheckboxes = filterForm.querySelectorAll('input[type="checkbox"]');
  window.pin = {
    getAddress: function () {
      return (mapPinMain.offsetLeft + Math.floor(mapPinMain.offsetWidth / 2)) + ', '
      + (mapPinMain.offsetTop + pinMainOffset.y);
    },

    render: function (arr) {
      renderPins(arr);
      pinsArray = arr;
    },

    update: window.library.debounce(function () {
      renderPins(filterPins(pinsArray));
    }),

    deactivate: function () {
      var activePin = document.querySelector('.map__pin--active');
      if (activePin) {
        activePin.classList.remove('map__pin--active');
      }
    },

    resetMain: function () {
      mapPinMain.style.cssText = mapPinMainDefaultPos;
      window.form.setAddress(window.pin.getAddress());
      filterForm.reset();
    },

    disableFilter: function () {
      [].forEach.call(filterBlocks, function (item) {
        item.disabled = true;
      });
    },

    enableFilter: function () {
      [].forEach.call(filterBlocks, function (item) {
        item.disabled = false;
      });
    }
  };

  mapPinMain.addEventListener('mousedown', onMapPinMainMouseDown);
  mapPinMain.addEventListener('keydown', onMainPinKeyDown);
  getPinSize();
  filterForm.addEventListener('change', onFilterFormChange);

  function renderPins(arr) {
    var currentPins = document.querySelectorAll('.map__pins .map__pin:not(.map__pin--main)');
    if (currentPins) {
      [].forEach.call(currentPins, function (elem) {
        elem.remove();
      });
    }
    var fragment = document.createDocumentFragment();
    var count = (arr.length > MAX_PINS) ? MAX_PINS : arr.length;

    for (var i = 0; i < count; i++) {
      fragment.appendChild(createPin(arr[i]));
    }

    mapPinList.appendChild(fragment);
  }

  function createPin(item) {
    var pinBlock = mapPinTemplate.cloneNode(true);
    var pinImg = pinBlock.querySelector('img');
    pinBlock.style.left = (item.location.x - pinOffsetX) + 'px';
    pinBlock.style.top = (item.location.y - pinOffsetY) + 'px';
    pinImg.src = item.author.avatar;
    pinImg.alt = item.offer.title;
    pinBlock.addEventListener('click', function () {
      window.card.render(item);
      window.pin.deactivate();
      pinBlock.classList.add('map__pin--active');
    });
    return pinBlock;
  }

  function onMapPinMainMouseDown(evt) {
    evt.preventDefault();
    if (!evt.button) {
      var startMousePosition = {
        x: evt.clientX,
        y: evt.clientY
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }

    function onMouseMove(evtMove) {
      evtMove.preventDefault();
      var distance = {
        x: startMousePosition.x - evtMove.clientX,
        y: startMousePosition.y - evtMove.clientY
      };

      startMousePosition.x = evtMove.clientX;
      startMousePosition.y = evtMove.clientY;
      mapPinMain.style.left =
        Math.min(Math.max(-pinMainOffset.x, (mapPinMain.offsetLeft - distance.x)),
            (window.map.mapBlock.offsetWidth - pinMainOffset.x)) + 'px';
      mapPinMain.style.top =
        Math.min(Math.max((MIN_Y - pinMainOffset.y), (mapPinMain.offsetTop - distance.y)),
            (MAX_Y - pinMainOffset.y)) + 'px';
      window.form.setAddress(window.pin.getAddress());
    }

    function onMouseUp(evtUp) {
      evtUp.preventDefault();
      if (!evt.button) {
        initializeAll();
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }
    }
  }

  function onMainPinKeyDown(evt) {
    if (evt.keyCode === window.data.ENTER_KEYCODE) {
      initializeAll();
      mapPinMain.removeEventListener('keydown', onMainPinKeyDown);
    }
  }

  function initializeAll() {
    if (!window.form.isActive()) {
      window.form.activate();
      window.map.render();
    }

    window.form.setAddress(window.pin.getAddress());
  }

  function onFilterFormChange() {
    window.card.clear();
    window.pin.update();
  }

  function filterPins(arr) {
    return arr.slice().filter(function (elem) {
      return checkPinFiltered(elem);
    });
  }

  function checkPinFiltered(pin) {
    if (filterType.value !== 'any' && filterType.value !== pin.offer.type) {
      return false;
    }
    if (filterPrice.value !== 'any') {
      switch (filterPrice.value) {
        case 'low':
          if (!window.library.checkInRange(parseInt(pin.offer.price, 10), null, FILTER_LOW)) {
            return false;
          }
          break;
        case 'middle':
          if (!window.library.checkInRange(parseInt(pin.offer.price, 10), FILTER_LOW, FILTER_HIGH)) {
            return false;
          }
          break;
        case 'high':
          if (!window.library.checkInRange(parseInt(pin.offer.price, 10), FILTER_HIGH)) {
            return false;
          }
          break;
      }
    }
    if (filterRooms.value !== 'any') {
      if (parseInt(filterRooms.value, 10) !== parseInt(pin.offer.rooms, 10)) {
        return false;
      }
    }
    if (filterGuests.value !== 'any') {
      if (parseInt(filterGuests.value, 10) !== parseInt(pin.offer.guests, 10)) {
        return false;
      }
    }
    for (var i = 0; i < filterCheckboxes.length; i++) {
      if (filterCheckboxes[i].checked &&
        (pin.offer.features.indexOf(filterCheckboxes[i].value) < 0) &&
        true) {
        return false;
      }
    }
    return true;
  }

  function getPinSize() {
    var pin = mapPinTemplate.cloneNode(true);
    pin.style.visibility = 'hidden';
    mapPinList.appendChild(pin);
    var size = {
      width: pin.offsetWidth,
      height: pin.offsetHeight
    };
    mapPinList.removeChild(pin);

    return size;
  }
})();
