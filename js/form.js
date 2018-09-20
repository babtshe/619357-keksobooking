'use strict';

(function () {
  var NO_GUESTS_ROOM = '100';
  var isFormActive = false;
  var adForm = document.querySelector('.ad-form');
  var addressField = adForm.querySelector('#address');
  var disabableBlocks = adForm.querySelectorAll('fieldset, button');
  var typeField = adForm.querySelector('#type');
  var priceField = adForm.querySelector('#price');
  var isPriceChanged = false;
  var timeInField = adForm.querySelector('#timein');
  var timeOutField = adForm.querySelector('#timeout');
  var roomsField = adForm.querySelector('#room_number');
  var capacityField = adForm.querySelector('#capacity');
  var resetButton = adForm.querySelector('.ad-form__reset');
  var invalidClass = 'invalid_value';
  window.form = {
    activate: function () {
      activateForm();
    },

    disable: function () {
      disableForm();
    },

    isActive: function () {
      return isFormActive;
    },

    setAddress: function (address) {
      addressField.value = address;
    }
  };

  function disableForm() {
    if (!adForm.classList.contains('ad-form--disabled')) {
      adForm.classList.add('ad-form--disabled');
    }
    [].forEach.call(disabableBlocks, function (item) {
      item.disabled = true;
    });
    removeFormListeners();
    isFormActive = false;
  }

  function activateForm() {
    isFormActive = true;
    adForm.classList.remove('ad-form--disabled');
    [].forEach.call(disabableBlocks, function (item) {
      item.disabled = false;
    });
    createFormListeners();
    window.upload.enable();
  }

  function createFormListeners() {
    adForm.addEventListener('submit', onFormSubmit);
    typeField.addEventListener('change', onTypeFieldChange);
    priceField.addEventListener('change', onPriceFieldChange);
    timeInField.addEventListener('change', onTimeInFieldChange);
    timeOutField.addEventListener('change', onTimeOutFieldChange);
    roomsField.addEventListener('change', onRoomsFieldChange);
    resetButton.addEventListener('click', onResetButtonClick);
    resetButton.addEventListener('keydown', onResetButtonKeydown);
  }

  function removeFormListeners() {
    adForm.removeEventListener('submit', onFormSubmit);
    typeField.removeEventListener('change', onTypeFieldChange);
    priceField.removeEventListener('change', onPriceFieldChange);
    timeInField.removeEventListener('change', onTimeInFieldChange);
    timeOutField.removeEventListener('change', onTimeOutFieldChange);
    roomsField.removeEventListener('change', onRoomsFieldChange);
    resetButton.removeEventListener('click', onResetButtonClick);
    resetButton.removeEventListener('keydown', onResetButtonKeydown);
  }

  function onTypeFieldChange() {
    updatePriceFieldLimits();
    if (!isPriceChanged) {
      priceField.value = window.data.offerTypes[typeField.value].minPrice;
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

  function onFormSubmit(evt) {
    window.backend.save(new FormData(adForm), function () {
      pageReset();
      window.modal.success();
    }, window.modal.error);
    evt.preventDefault();
  }

  function onResetButtonClick(evt) {
    evt.preventDefault();
    pageReset();
  }

  function onResetButtonKeydown(evt) {
    if (evt.keyCode === window.data.ENTER_KEYCODE) {
      pageReset();
    }
  }

  function pageReset() {
    window.card.clear();
    adForm.reset();
    updatePriceFieldLimits();
    window.upload.reset();
    window.pin.resetMain();
    window.pin.update();
  }

  function updatePriceFieldLimits() {
    priceField.setAttribute('min', window.data.offerTypes[typeField.value].minPrice);
    priceField.setAttribute('placeholder', window.data.offerTypes[typeField.value].minPrice);
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
})();
