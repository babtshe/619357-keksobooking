'use strict';

(function () {
  var STATUS_OK = 200;
  window.backend = {
    load: function (onLoad, onError) {
      loadData(onLoad, onError);
    },

    save: function (data, onLoad, onError) {
      saveData(data, onLoad, onError);
    }
  };
  var responseData;

  function loadData(onLoad, onError) {
    var URL = 'https://js.dump.academy/keksobooking/data';
    var xhr = new XMLHttpRequest();

    xhr.addEventListener('load', function () {
      if (xhr.status === STATUS_OK) {
        responseData = xhr.response;
        if (typeof responseData === 'string') {
          responseData = JSON.parse(responseData);
        }
        onLoad(responseData);
      } else {
        onError(xhr.status + ': ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Соединиться не получилось.');
    });

    xhr.addEventListener('timeout', function () {
      onError('Ответ сервера не получен за ' + (xhr.timeout / 1000) + ' сек.');
    });

    xhr.open('GET', URL);
    xhr.responseType = 'json';
    xhr.timeout = 5000;
    xhr.send();
  }

  function saveData(data, onLoad, onError) {
    var URL = 'https://js.dump.academy/keksobooking';
    var xhr = new XMLHttpRequest();

    xhr.addEventListener('load', function () {
      if (xhr.status === STATUS_OK) {
        responseData = xhr.response;
        if (typeof responseData === 'string') {
          responseData = JSON.parse(responseData);
        }
        onLoad(responseData);
      } else {
        onError(xhr.status + ': ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Отправить не получилось.');
    });

    xhr.addEventListener('timeout', function () {
      onError('Ответ сервера не получен за ' + (xhr.timeout / 1000) + ' сек.');
    });

    xhr.open('POST', URL);
    xhr.responseType = 'json';
    xhr.timeout = 5000;
    xhr.send(data);
  }
})();
