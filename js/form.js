'use strict';
(function () {
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

  var isFormActive = false;
  var adForm = document.querySelector('.ad-form');
  var addressField = adForm.querySelector('#address');
  var fieldsets = adForm.querySelectorAll('fieldset');
  var typeField = adForm.querySelector('#type');
  var priceField = adForm.querySelector('#price');
  var isPriceChanged = false;
  var timeInField = adForm.querySelector('#timein');
  var timeOutField = adForm.querySelector('#timeout');
  var roomsField = adForm.querySelector('#room_number');
  var capacityField = adForm.querySelector('#capacity');
  var NO_GUESTS_ROOM = '100';
  var invalidClass = 'invalid_value';


  function disableForm() {
    isFormActive = false;
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
    adForm.classList.remove('ad-form--disabled');
    for (var i = 0; i < fieldsets.length; i++) {
      fieldsets[i].disabled = false;
    }
    createFormListeners();
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
    priceField.setAttribute('min', window.data.offerTypes[currentType].minPrice);
    priceField.setAttribute('placeholder', window.data.offerTypes[currentType].minPrice);
    if (!isPriceChanged) {
      priceField.value = window.data.offerTypes[currentType].minPrice;
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

})();
