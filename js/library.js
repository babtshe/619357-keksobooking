'use strict';
(function () {
  var DEBOUNCE_DEFAULT = 500;
  window.library = {
    hideBlock: function (block) {
      if (!block.classList.contains('hidden')) {
        block.classList.add('hidden');
      }
    },

    showBlock: function (block) {
      if (block.classList.contains('hidden')) {
        block.classList.remove('hidden');
      }
    },

    checkClassInArray: function (classList, arr, prefix) {
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
    },

    getRandomKey: function (obj) {
      var keys = Object.keys(obj);
      return keys[keys.length * Math.floor(Math.random())];
    },

    getRandomValue: function (arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    },

    getRandomInt: function (min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.round(Math.random() * (max - min)) + min;
    },

    shuffleArray: function (array) { // Fisher–Yates shuffle
      var m = array.length;
      var t;
      var i;

      while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
      }
    },

    getRandomArray: function (arr) {
      window.library.shuffleArray(arr);
      var counter = Math.floor(Math.random() * arr.length);
      return arr.slice(counter, arr.length);
    },

    debounce: function (func, delay) {
      var lastTimeout = null;
      if (delay === undefined) {
        delay = DEBOUNCE_DEFAULT;
      }

      return function () {
        var args = arguments;
        if (lastTimeout) {
          window.clearTimeout(lastTimeout);
        }
        lastTimeout = window.setTimeout(function () {
          func.apply(null, args);
        }, delay);
      };
    },

    checkInRange: function (number, start, end) {
      if (start === undefined) {
        start = -Infinity;
      }
      if (end === undefined) {
        end = Infinity;
      }
      return (start <= number && number <= end);
    }
  };

  if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function () {
      if (this.parentNode) {
        this.parentNode.removeChild(this);
      }
    };
  }
})();
