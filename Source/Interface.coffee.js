/*
---

name: Interface

description: Interfaces for Class to ensure certain properties are defined.

authors: Christoph Pojer (@cpojer), Luis Merino (@Rendez)

license: MIT-style license.

requires: [Core/Type, Core/Class]

provides: Interface

...
*/(function(context) {
  this.Interface = new Type('Interface', function(object) {
    if (object.Implements) {
      Array.from(object.Implements).each(function(item) {
        return Object.append(this, item);
      }, this);
      delete object.Implements;
    }
    return Object.append(this, object);
  });
  return Class.Mutators.initialize = function(fn) {
    if (this.prototype.Interface) {
      return function() {
        var iface, interfaces, result, _i, _len;
        result = fn.apply(this, arguments);
        if (!this.Interface) {
          return result;
        }
        interfaces = Array.from(this.Interface);
        for (_i = 0, _len = interfaces.length; _i < _len; _i++) {
          iface = interfaces[_i];
          Object.keys(iface).each(function(key) {
            var item, name, oType, object, proto, type;
            if (key.charAt(0) === '$') {
              return;
            }
            if (!(key in this)) {
              throw new Error('Instance does not implement "' + key + '"');
            }
            item = this[key];
            object = iface[key];
            if (object === null) {
              return;
            }
            type = typeOf(item);
            oType = typeOf(object);
            if (type !== oType && !instanceOf(item, object)) {
              proto = object.prototype;
              name = proto && proto.$family ? proto.$family().capitalize() : object.displayName;
              throw new Error("Property \"" + key + "\" is implemented but not an instance of " + (name ? '"' + name + '"' : 'the expected type'));
            }
            if (oType === 'function' && item.$origin.length < object.length) {
              throw new Error(("Property \"" + key + "\" does not implement at least " + object.length + " parameter") + (object.length !== 1 ? 's' : ''));
            }
          }, this);
        }
        return result;
      };
    } else {
      return fn;
    }
  };
}).call(typeof exports !== 'undefined' ? exports : this);
