'use strict';
(function () {
  window.modal = {
    error: function (msg) {
      showPopup(msg);
    },

    success: function () {
      showSuccess();
    }
  };

  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var popup = document.querySelector('.popup-message');
  var successBlock = document.querySelector('.success');
  var errorText = popup.querySelector('.popup-message__text');
  var popupClose = popup.querySelector('.popup-message__close');

  function showPopup(message) {
    createPopupListeners();
    errorText.textContent = message;
    window.library.showBlock(popup);
  }

  function hidePopup() {
    removePopupListeners();
    window.library.hideBlock(popup);
  }

  function showSuccess() {
    createSuccessListeners();
    window.library.showBlock(successBlock);
  }

  function hideSuccess() {
    removeSuccessListeners();
    window.library.hideBlock(successBlock);
  }

  function createPopupListeners() {
    document.addEventListener('keydown', onPopupEscPress);
    popup.addEventListener('click', onPopupCloseClick);
    popupClose.addEventListener('click', onPopupCloseClick);
    popupClose.addEventListener('keydown', onPopupCloseEnterPress);
  }

  function removePopupListeners() {
    document.removeEventListener('keydown', onPopupEscPress);
    popup.removeEventListener('click', onPopupCloseClick);
    popupClose.removeEventListener('click', onPopupCloseClick);
    popupClose.removeEventListener('keydown', onPopupCloseEnterPress);
  }

  function createSuccessListeners() {
    document.addEventListener('keydown', onSuccessEscPress);
    successBlock.addEventListener('click', onSuccessCloseClick);
  }

  function removeSuccessListeners() {
    document.removeEventListener('keydown', onSuccessEscPress);
    successBlock.removeEventListener('click', onSuccessCloseClick);
  }

  function onPopupEscPress(evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      hidePopup();
    }
  }

  function onPopupCloseClick() {
    hidePopup();
  }

  function onPopupCloseEnterPress(evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      hidePopup();
    }
  }

  function onSuccessEscPress(evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      hideSuccess();
    }
  }

  function onSuccessCloseClick() {
    hideSuccess();
  }
})();
