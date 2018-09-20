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
      [].forEach.call(classList, function (item) {
        if (item.indexOf(prefix) >= 0) {
          var currentClass = item.replace(prefix, '');
          result = (arr.indexOf(currentClass) >= 0);
        }
      });
      return result;
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
