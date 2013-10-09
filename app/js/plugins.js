// Commonalities.
!function(exports) {

  function mix(receiver, provider) {
    for (var key in provider) {
      receiver[key] = provider[key];
    }

    return receiver;
  }

  function extend(props, statics) {
    var parent = this,
        child = (props && props.hasOwnProperty('constructor'))
            ? props.constructor
            : function() { parent.apply(this, arguments); };

    mix(child, parent);
    mix(child, statics);

    var EmptyConstructor = function(){ this.constructor = child; };
    EmptyConstructor.prototype = parent.prototype;
    child.prototype = new EmptyConstructor;

    if (props) {
      mix(child.prototype, props);
    }

    child.__super__ = parent.prototype;

    return child;
  }

  var slice = Array.prototype.slice;

  function bind(func, context) {
    if (func.bind === Function.prototype.bind) {
      return Function.prototype.bind.apply(func, slice.call(arguments, 1));
    }

    var args = slice.call(arguments, 2);
    return function() {
      return func.apply(context, args.concat(slice.call(arguments)));
    };
  }

  var Component = function() {};
  Component.extend = extend;
  Component.bind = bind;

  exports.Component = Component;

  function CanvasSupported() {
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
  }

  exports.CanvasSupported = CanvasSupported;

  exports.Browser = (function() {
    var ua = navigator.userAgent,
        webkit = /AppleWebKit\/([^\s]*)/.test(ua);

    return {
      webkit:  webkit,
      msie:    !webkit && /MSIE\s([^;]*)/.test(ua),
      mozilla: !webkit && /Gecko\/([^\s]*)/.test(ua),
      ios:     webkit && /(iPhone|iPad|iPod)/.test(ua),
      android: webkit && /Android/.test(ua)
    };
  })();

}(window);