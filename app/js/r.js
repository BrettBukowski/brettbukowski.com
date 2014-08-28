(function () {
  'use strict';

  Array.from = Array.from || function (arrayLike, mapFn, context) {
    var array = Array.prototype.slice.call(arrayLike);

    if (typeof mapFn == 'function') {
      var mapped = [];
      for (var i = 0, len = array.length; i < len; i++) {
        mapped.push(mapFn.call(context || null, array[i], i, array));
      }

      return mapped;
    }

    return array;
  };

  function createEl (name, attributes) {
    var el = document.createElement(name);

    for (var i in attributes) {
      if (attributes.hasOwnProperty(i)) {
        el[i] = attributes[i];
      }
    }

    return el;
  }

  function mouseHandler (e) {
    e.target.nextSibling.classList.toggle('visible');
  }

  Array.from(document.querySelectorAll('[title]'), function (el) {
    var indicator = createEl('div', {
      'innerHTML': '?',
      'className': 'what'
    });

    el.parentNode.insertBefore(indicator, el.nextSibling);

    var tooltip = createEl('div', {
      'className': 'tooltip',
      'innerHTML': el.getAttribute('title')
    });

    indicator.parentNode.insertBefore(tooltip, indicator.nextSibling);

    el.removeAttribute('title');

    indicator.addEventListener('mouseout', mouseHandler);
    indicator.addEventListener('mouseover', mouseHandler);
  });

})();
