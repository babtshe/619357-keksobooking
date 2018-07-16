'use strict';

(function () {
  var offers = [];
  var MAX_OFFERS = 8;
  var MAX_PRICE = 1000000;
  var MIN_PRICE = 1000;
  var MIN_ROOMS = 1;
  var MAX_ROOMS = 5;
  var NO_GUESTS_ROOM = '100';
  var MIN_GUESTS = 0;
  var MAX_GUESTS = 5;
  var MIN_X = 300;
  var MAX_X = 900;
  var MIN_Y = 130;
  var MAX_Y = 630;
  var PIN_AFTER_OFFSET = 22;
  var FEATURE_PREFIX = 'popup__feature--';
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
  var offerTypes = {
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
  };
  var checkinTimes = ['12:00', '13:00', '14:00'];
  var checkoutTimes = ['12:00', '13:00', '14:00'];
  var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var photos = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];
  var mapBlock = document.querySelector('.map');
  var template = document.querySelector('template');
  var adForm = document.querySelector('.ad-form');
  var isFormActive = false;
  var addressField = adForm.querySelector('#address');
  var typeField = adForm.querySelector('#type');
  var priceField = adForm.querySelector('#price');
  var isPriceChanged = false;
  var timeInField = adForm.querySelector('#timein');
  var timeOutField = adForm.querySelector('#timeout');
  var roomsField = adForm.querySelector('#room_number');
  var capacityField = adForm.querySelector('#capacity');
  var invalidClass = 'invalid_value';
  var mapCardTemplate;
  var mapPinTemplate;
  try {
    mapCardTemplate = template.content.querySelector('.map__card');
    mapPinTemplate = template.content.querySelector('.map__pin');
  } catch (error) { //  fix for IE
    mapCardTemplate = template.querySelector('.map__card');
    mapPinTemplate = template.querySelector('.map__pin');
    hideTemplate();
  }
  var mapPinsList = document.querySelector('.map__pins');
  var mapPinMain = document.querySelector('.map__pin--main');
  var mapFiltersBlock = document.querySelector('.map__filters-container');
  var pinOffsetX = Math.round(mapPinTemplate.clientWidth / 2);
  var pinOffsetY = Math.round(mapPinTemplate.clientHeight + PIN_AFTER_OFFSET);
  var pinMainOffset = {
    x: Math.floor(mapPinMain.offsetWidth / 2),
    y: mapPinMain.offsetHeight + pinOffsetY
  };
  var fieldsets = adForm.querySelectorAll('fieldset');

  generateOffers(MAX_OFFERS);
  disableForm();
  mapPinMain.addEventListener('mousedown', onMapPinMainMouseDown);

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
            (mapBlock.offsetWidth - pinMainOffset.x)) + 'px';
      mapPinMain.style.top =
        Math.min(Math.max((MIN_Y - pinMainOffset.y), (mapPinMain.offsetTop - distance.y)), (MAX_Y - pinMainOffset.y)) + 'px';
      setAddress();
    }

    function onMouseUp(evtUp) {
      evtUp.preventDefault();
      if (!evt.button) {
        if (!isFormActive) {
          activateForm();
        } else {
          setAddress();
        }

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }
    }
  }

  function generateOffers(counter) {
    var position = {};

    shuffleArray(offerTitles);

    for (var i = 0; i < counter; i++) {
      position = {
        x: getRandomInt(MIN_X, MAX_X),
        y: getRandomInt(MIN_Y, MAX_Y)
      };

      shuffleArray(photos);
      addOffer(i, position, photos);
    }
  }

  function disableForm() {
    isFormActive = false;
    if (!mapBlock.classList.contains('map--faded')) {
      mapBlock.classList.add('map--faded');
    }
    if (!adForm.classList.contains('ad-form--disabled')) {
      adForm.classList.add('ad-form--disabled');
    }
    for (var i = 0; i < fieldsets.length; i++) {
      fieldsets[i].disabled = true;
    }
    removeFormListeners();
  }

  function activateForm() {
    isFormActive = true;
    showMap();
    setAddress();
    adForm.classList.remove('ad-form--disabled');
    for (var i = 0; i < fieldsets.length; i++) {
      fieldsets[i].disabled = false;
    }
    createFormListeners();
    renderPins(offers);
    renderCard(offers[0]);
    createCardListeners();
  }

  function createFormListeners() {
    typeField.addEventListener('change', onTypeFieldChange);
    priceField.addEventListener('change', onPriceFieldChange);
    timeInField.addEventListener('change', onTimeInFieldChange);
    timeOutField.addEventListener('change', onTimeOutFieldChange);
    roomsField.addEventListener('change', onRoomsFieldChange);
  }

  function removeFormListeners() {
    typeField.removeEventListener('change', onTypeFieldChange);
    priceField.removeEventListener('change', onPriceFieldChange);
    timeInField.removeEventListener('change', onTimeInFieldChange);
    timeOutField.removeEventListener('change', onTimeOutFieldChange);
    roomsField.removeEventListener('change', onRoomsFieldChange);
  }

  function onTypeFieldChange() {
    var currentType = typeField.value;
    priceField.setAttribute('min', offerTypes[currentType].minPrice);
    priceField.setAttribute('placeholder', offerTypes[currentType].minPrice);
    if (!isPriceChanged) {
      priceField.value = offerTypes[currentType].minPrice;
    } else {
      markFieldValidity(priceField);
    }
  }

  function onPriceFieldChange() {
    isPriceChanged = true;
    markFieldValidity(priceField);
  }

  function onTimeInFieldChange() {
    timeOutField.value = timeInField.value;
  }

  function onTimeOutFieldChange() {
    timeInField.value = timeOutField.value;
  }

  function onRoomsFieldChange() {
    modifyGuestOptions(roomsField.value);
  }

  function markFieldValidity(field) {
    if (field.getAttribute('min') === '0' && field.value === '') {
      field.value = '0';
    }

    if (!field.checkValidity() && !field.classList.contains(invalidClass)) {
      field.classList.add(invalidClass);
      field.reportValidity();
    } else if (field.checkValidity() && field.classList.contains(invalidClass)) {
      field.classList.remove(invalidClass);
    }
  }

  function modifyGuestOptions(rooms) {
    if (rooms === NO_GUESTS_ROOM) {
      rooms = 0;
    }

    for (var i = 0; i < capacityField.length; i++) {
      if (capacityField.options[i].value <= rooms && capacityField.options[i].value > 0) {
        capacityField.options[i].disabled = false;
      } else if (rooms === 0 && capacityField.options[i].value === '0') {
        capacityField.options[i].disabled = false;
        capacityField.options[i].selected = true;
      } else {
        capacityField.options[i].disabled = true;
        if (capacityField.options[i].value === capacityField.value) {
          capacityField.options[i].selected = false;
        }
      }
    }
  }

  function createCardListeners() {
    for (var i = 0; i < mapPinsList.children.length; i++) {
      if (!mapPinsList.children[i].classList.contains('map__pin--main')
      && mapPinsList.children[i].classList.contains('map__pin')) {
        mapPinsList.children[i].addEventListener('click', function (evt) {
          renderCard(offers[evt.currentTarget.getAttribute('data-key')]);
        });
      }
    }
  }

  function setAddress() {
    addressField.value = getAddress();
  }

  function getAddress() {
    return (mapPinMain.offsetLeft + Math.floor(mapPinMain.offsetWidth / 2)) + ', '
    + (mapPinMain.offsetTop + pinMainOffset.y);
  }

  function showMap() {
    mapBlock.classList.remove('map--faded');
  }

  function renderPins(arr) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < arr.length; i++) {
      fragment.appendChild(createPin(arr[i], i));
    }

    mapPinsList.appendChild(fragment);
  }

  function renderCard(item) {
    var currentCard = document.querySelector('.map__card.popup');
    if (currentCard) {
      currentCard.remove();
    }
    mapFiltersBlock.insertAdjacentElement('beforeBegin', createCard(item));
  }

  function createCard(item) {
    var card = mapCardTemplate.cloneNode(true);
    var cardClose = card.querySelector('.popup__close');
    var featuresList = card.querySelector('.popup__features');
    var photosList = card.querySelector('.popup__photos');
    card.querySelector('.popup__title').textContent = item.offer.title;
    card.querySelector('.popup__text--address').textContent = item.offer.address;
    card.querySelector('.popup__text--price').textContent = item.offer.price + ' ₽/ночь';
    card.querySelector('.popup__type').textContent = getOfferTypeText(item.offer.type);
    card.querySelector('.popup__text--capacity').textContent = getCapacityText(item.offer.rooms, item.offer.guests);
    card.querySelector('.popup__text--time').textContent = 'Заезд после ' + item.offer.checkin + ', выезд до ' + item.offer.checkout + '.';
    createFeatures(featuresList, item.offer.features);
    card.querySelector('.popup__description').textContent = item.offer.description;
    createPhotos(photosList, item.offer.photos);
    card.querySelector('.popup__avatar').src = item.author.avatar;
    cardClose.addEventListener('click', function () {
      cardClose.parentNode.remove();
    });
    return card;
  }

  function addOffer(index, position, pictures) {
    offers.push({
      author: {
        avatar: 'img/avatars/user0' + (index + 1) + '.png'
      },

      offer: {
        title: offerTitles[index],
        address: position.x + ', ' + position.y,
        price: getRandomInt(MIN_PRICE, MAX_PRICE),
        type: getRandomKey(offerTypes),
        rooms: getRandomInt(MIN_ROOMS, MAX_ROOMS),
        guests: getRandomInt(MIN_GUESTS, MAX_GUESTS),
        checkin: getRandomValue(checkinTimes),
        checkout: getRandomValue(checkoutTimes),
        features: getRandomArray(features),
        description: '',
        photos: pictures.slice()
      },

      location: {
        x: position.x,
        y: position.y
      }
    });
  }

  function createPin(item, id) {
    var pinBlock = mapPinTemplate.cloneNode(true);
    var pinImg = pinBlock.querySelector('img');
    pinBlock.style.left = (item.location.x - pinOffsetX) + 'px';
    pinBlock.style.top = (item.location.y - pinOffsetY) + 'px';
    pinImg.src = item.author.avatar;
    pinImg.alt = item.offer.title;
    pinBlock.setAttribute('data-key', id);
    return pinBlock;
  }

  function createFeatures(listBlock, featuresArray) {
    for (var i = 0; i < listBlock.children.length; i++) {
      if (!checkClassInArray(listBlock.children[i].classList, featuresArray, FEATURE_PREFIX)) {
        listBlock.removeChild(listBlock.children[i]);
        i--;
      }
    }
  }

  function createPhotos(photosBlock, photosArray) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < photosArray.length; i++) {
      var photo = photosBlock.querySelector('.popup__photo').cloneNode(true);
      photo.src = photosArray[i];
      fragment.appendChild(photo);
    }

    photosBlock.innerHTML = '';
    photosBlock.appendChild(fragment);
  }

  function getCapacityText(rooms, guests) {
    var result = '';
    switch (rooms) {
      default:
        result = rooms + ' комнаты ';
        break;
      case 1:
        result = rooms + ' комната ';
        break;
      case 5:
        result = rooms + ' комнат ';
        break;
    }

    switch (guests) {
      default:
        result += 'для ' + guests + ' гостей.';
        break;
      case 1:
        result += 'для ' + guests + ' гостя.';
        break;
      case 0:
        result += 'не для гостей.';
    }
    return result;
  }

  function getOfferTypeText(type) {
    return offerTypes[type].text;
  }

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.round(Math.random() * (max - min)) + min;
  }

  function getRandomValue(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function getRandomKey(obj) {
    var keys = Object.keys(obj);
    return keys[keys.length * Math.floor(Math.random())];
  }

  function getRandomArray(arr) {
    shuffleArray(arr);
    var counter = Math.floor(Math.random() * arr.length);
    return arr.slice(counter, arr.length);
  }

  function shuffleArray(array) { // Fisher–Yates shuffle
    var m = array.length;
    var t;
    var i;

    while (m) {
      i = Math.floor(Math.random() * m--);
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
  }

  function checkClassInArray(classList, arr, prefix) {
    var result = false;
    for (var i = 0; i < classList.length; i++) {
      if (classList[i].indexOf(prefix) >= 0) {
        var currentClass = classList[i].replace(prefix, '');
        if (arr.indexOf(currentClass) >= 0) {
          result = true;
        }
      }
    }
    return result;
  }

  function hideTemplate() {
    template.style.display = 'none';
  }
}());
