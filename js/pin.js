'use strict';
(function () {
  window.pin = {
    getAddress: function () {
      return (mapPinMain.offsetLeft + Math.floor(mapPinMain.offsetWidth / 2)) + ', '
      + (mapPinMain.offsetTop + pinMainOffset.y);
    },

    render: function (arr) {
      renderPins(arr);
    },

    mapPinsList: document.querySelector('.map__pins')
  };

  var mapPinTemplate;
  try {
    mapPinTemplate = window.data.template.content.querySelector('.map__pin');
  } catch (error) {
    mapPinTemplate = window.data.template.querySelector('.map__pin');
  }
  var pinOffsetX = Math.round(getPinSize().width / 2);
  var pinOffsetY = Math.round(getPinSize().height);
  var PIN_AFTER_OFFSET = 16;
  var mapPinMain = document.querySelector('.map__pin--main');
  var pinMainOffset = {
    x: Math.floor(mapPinMain.offsetWidth / 2),
    y: mapPinMain.offsetHeight + PIN_AFTER_OFFSET
  };
  var MIN_Y = 130;
  var MAX_Y = 630;

  mapPinMain.addEventListener('mousedown', onMapPinMainMouseDown);
  getPinSize();

  function renderPins(arr) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < arr.length; i++) {
      fragment.appendChild(createPin(arr[i]));
    }

    window.pin.mapPinsList.appendChild(fragment);
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
        if (!window.form.isActive()) {
          window.form.activate();
          window.map.render();
        }

        window.form.setAddress(window.pin.getAddress());
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }
    }
  }

  function getPinSize() {
    var pin = mapPinTemplate.cloneNode(true);
    pin.style.visibility = 'hidden';
    window.pin.mapPinsList.appendChild(pin);
    var size = {
      width: pin.offsetWidth,
      height: pin.offsetHeight
    };
    window.pin.mapPinsList.removeChild(pin);

    return size;
  }

})();
