(function () { "use strict";
    function deepCopy(obj) {
    if(typeof obj !== 'object' || obj === null) {
        return obj;
    }

    if(obj instanceof Date) {
        return new Date(obj.getTime());
    }

    if(obj instanceof Array) {
        return obj.reduce((arr, item, i) => {
            arr[i] = deepCopy(item);
            return arr;
        }, []);
    }

    if(obj instanceof Object) {
        return Object.keys(obj).reduce((newObj, key) => {
            newObj[key] = deepCopy(obj[key]);
            return newObj;
        }, {})
    }
  }

  // export as AMD module / Node module / browser variable
  if (typeof define === 'function' && define.amd) {
    define(function() {
        return deepCopy;
    });
  } else if (typeof module !== 'undefined') {
    module.exports = deepCopy;
  } else {
    window.deepCopy = deepCopy;
  }
})();
