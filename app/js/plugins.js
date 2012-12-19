// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function noop() {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.

!function(exports) {

    var emptyConstructor = function() {};

function mix(receiver, provider) {
    for (key in provider) {
        receiver[key] = provider[key];
    }

    return receiver;
}

function inherit(parent, props, statics) {
    var child = (props && props.hasOwnProperty('constructor'))
        ? props.constructor
        : function() { parent.apply(this, arguments); };

    mix(child, parent);

    emptyConstructor.prototype = parent.prototype;
    child.constructor = new emptyConstructor();

    if (props) {
        mix(child.prototype, props);
    }
    if (statics) {
        mix(child, statics);
    }

    child.prototype.constructor = child;
    child.__super__ = parent.prototype;

    return child;
}

function extend(props, statics) {
    var child = inherit(this, props, statics);
    child.extend = this.extend;

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

}(window);