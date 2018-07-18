'use strict';
(function () {
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
    }
  };
})();
