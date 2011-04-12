###
---

name: Interface

description: Interfaces for Class to ensure certain properties are defined.

authors: Christoph Pojer (@cpojer), Luis Merino (@Rendez)

license: MIT-style license.

requires: [Core/Type, Core/Class]

provides: Interface

...
###

((context) ->

  @Interface = new Type 'Interface', (object) ->
    if object.Implements
      Array.from(object.Implements).each (item) ->
        Object.append @, item
      , @

      delete object.Implements
  
    Object.append @, object

  Class.Mutators.initialize = (fn) ->
    return if @prototype.Interface 
      ->
        result = fn.apply @, arguments

        if !@Interface then return result

        interfaces = Array.from @Interface
        for iface in interfaces
          Object.keys(iface).each (key) ->
            if key.charAt(0) == '$' then return # Skip Internal

            if not (key of @) 
              throw new Error('Instance does not implement "' + key + '"');
        
            item = @[key]
            object = iface[key]
        
            if object is null then return
        
            type = typeOf(item)
            oType = typeOf(object)
        
            # Needs to be same datatype OR instance of the provided object
            if type isnt oType and not instanceOf(item, object)
              proto = object.prototype
              name = if (proto and proto.$family) then proto.$family().capitalize() else object.displayName
              throw new Error "Property \"#{key}\" is implemented but not an instance of #{if name then '"'+name+'"' else 'the expected type'}"
        
            if oType is 'function' and item.$origin.length < object.length
              throw new Error "Property \"#{key}\" does not implement at least #{object.length} parameter" + (if object.length isnt 1 then 's' else '')
          , @

        return result
    else
      fn

).call(if typeof exports isnt 'undefined' then exports else @)
