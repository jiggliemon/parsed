var events = require('yeah/mixin')
var request = require('./request')
var parsed = require('./parsed')

/**
 * Constructor 
 */
function Obj (name, options, methods) {
  var self = this
  this.name = name
  this.setDefaults(options.defaults)

  parsed.extend(this, methods)
}

/**
 * Static Methods 
 */
Obj.create = function ( name, options, methods) {
  var ParsedObject = function () {
    parsed.extend(this, methods)
    this.init.apply(this, arguments)
  }
  ParsedObject.prototype = new Obj( name, options )
  return ParsedObject
}


/**
 * Prototype Methods 
 */
parsed.extend(Obj.prototype, {

  /**
   *
   *
   */
  init: function (dataOrId) {
    var self = this
    if (typeof dataOrId === 'string') {
      self.setId(dataOrId)
      var arg = arguments[arguments.length-1]
      var cb = (typeof arg == 'function') ? arg: false
      self.fetchData(dataOrId,cb)
    } else {
      self.setData(dataOrId)
    }
    return self
  }

  ,config: parsed.config
  
  ,setId: function (id) {
    if ( id ) {
      this.id = id
    }
    return this
  }
  /**
   *
   *
   */
  ,getData: function () {
    var self = this
      , data = self._data = self._data || {}

    return data
  }

  /**
   *
   *
   */
  ,setData: function (data, val, ignoreDelta) {
    var self = this, k
      , _data = self._data = self._data || {}
      
    if ( typeof data == 'object' ) {
      for ( k in data ) {
        if ( data.hasOwnProperty(k) ) {
          self.setData(k, data[k])
        }
      }
    } else {
      _data[data] = val
      if ( !ignoreDelta ) {
        self.setDelta(data, _data[data])
      }
    }

    return self
  }

  /**
   *
   *
   */
  ,getDelta: function () {
    var self = this
      , delta = self._delta = self._delta || {}

    return delta
  }

  /**
   *
   *
   */
  ,setDelta: function (data, val) {
    var self = this, k
      , delta = self._delta = self._delta || {}
      
    if ( typeof data == 'object' ) {
      for ( k in data ) {
        if ( data.hasOwnProperty(k) ) {
          self.setDelta(k, data[k])
        }
      }
    } else {
      delta[data] = val
    }

    return self
  }

  /**
   *
   *
   */
  ,getDefaults: function () {
    var self = this
    self._defaults = self._defaults || {}
    return self._defaults
  }

  /**
   *
   *
   */
  ,setDefaults: function (def,val) {
    var self = this, k
    if (!def) return self

    self._defaults = self._defaults || {}

    if ( typeof def == 'string' ) {
      self._defaults[def] = val
    } else {
      for ( k in def ) {
        if ( def.hasOwnProperty(k) ) {
          self.setDefaults(k,def[k])
        }
      }
    }

    return self
  }

  /**
   *
   *
   */
  ,fetchData: function (id) {
    var self = this
    var objId = typeof(id) == 'string'? id : self.id

    // if we recieve a function on the tail of our arguments
    // we'll use that as a callback
    var cb = arguments[arguments.length -1]
    var callback = typeof(cb) == 'function'? cb : null

    if (id) {
      request.get('classes', self.name, id, function (err, data) {
        self.fireEvent('fetched data', err, data)
        self.setData(data, null, true)
        callback && callback.call(self, err, data)
      })  
    }
    return self
  }

  /**
   *
   *
   */
  ,update: function (callback) {
    var self = this
    request.put('classes', self.name+'/'+self.id, self.getDelta(), function (err, data) {
      self.fireEvent('updated', err, data)
      callback && callback.call(self, err, data)
    })
    return self
  }

  /**
   *
   *
   */
  ,save: function (callback) {
    var self = this
    var data = parsed.extend({}, self.getDefaults(), self.getData())

    request.post('classes', self.name, data, function(err, data) {
      self.fireEvent('saved', err, data)
      if ( err ) {
        throw new Error
      }

      if ( !self.id ) {
        self.id = data.objectId
      }

      callback && callback.call(self, err, data)
    })

    return self
  }

}, events)




module.exports = Obj;