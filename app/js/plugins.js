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

function CanvasSupported() {
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
}

exports.CanvasSupported = CanvasSupported;

}(window);