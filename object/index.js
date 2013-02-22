var events = require('yeah/mixin')
var request = require('../util/request')
var parsed = require('../parsed')
var lambda = function () {console.log('lambda fired')}
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
    this.setPlugins(options.implements)
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
    self.isNew = false
    if (typeof dataOrId === 'string') {
      self.setId(dataOrId)
      var arg = arguments[arguments.length-1]
      var cb = (typeof arg == 'function') ? arg: false
      self.fetchData(dataOrId,cb)
    } else {
      self.setData(dataOrId)
      self.isNew = true
    }
    return self
  }

  ,config: parsed.config
  
  ,getPlugins: function() {
    var self = this
    self._plugins = self._plugins || {}
    return self._plugins
  }

  ,setPlugins: function (plugins) {
    var self = this
      , plugins = Array.isArray(plugins)?plugins:Array.prototype.slice.call(arguments, 0)
      , _plugins = self.getPlugins()

    while (plugins.length) {
      var plugin = plugins.pop()
      if (typeof plugin == 'function') {
        _plugins[plugin.name] = new plugin
      }
    }
  }
  /**
   *
   * @param {string} id
   */
  ,setId: function (id) {
    this.id = id
    return this
  }

  /**
   *
   *
   */
  ,getData: function (key) {
    var self = this
      , data = self._data = self._data || {}

    return key? data[key] : data
  }

  /**
   *  @param {object|string} data
   *  @param val
   */
  ,setData: function (data, val, ignoreDelta) {
    var self = this, k
      , _data = self.getData()
      
    if ( typeof data == 'object' ) {
      for ( k in data ) {
        if ( data.hasOwnProperty(k) ) {
          self.setData(k, data[k])
        }
      }
    } else {
      if (_data[data] !== val ) {
        _data[data] = val
        self.fireEvent('data.set', data, val)
        if ( !ignoreDelta ) {
          self.setDelta(data, _data[data])
        }
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
      , delta = self.getDelta()
      
    if ( typeof data == 'object' ) {
      for ( k in data ) {
        if ( data.hasOwnProperty(k) ) {
          self.setDelta(k, data[k])
        }
      }
    } else {
      try {
        self.fireEvent('before.set', data, val)
        delta[data] = val
      } catch (e) { }
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
   * @param {object|string} def
   * @param val
   */
  ,setDefaults: function (def,val) {
    var self = this, k
    if (!def) return self

    _defaults = self.getDefaults()

    if ( typeof def == 'string' ) {
      _defaults[def] = val
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
   * @param {string} id
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
   * @param {function} callback
   */
  ,_update: function (data, callback) {
    var self = this

    request.put('classes', self.name+'/'+self.id, self.getDelta(), function (err, data) {
      self.fireEvent('updated', err, data)
      callback && callback.call(self, err, data)
    })
    return self
  }

  /**
   *
   * @param {function} callback
   */
  ,save: function () {
    var self = this
    var args = arguments
    var callback = typeof args[args.length-1] == 'function' ? args[args.length-1] : lambda
    
    if (typeof args[0] == 'object') {
      self.setData(args[0])
    }
    
    var data = parsed.extend({}, self.getDefaults(), self.getData())
    
    if (!self.isNew) {
      return self._update(data, callback)
    }

    request.post('classes', self.name, data, function(err, data) {
      self.fireEvent('saved', err, data)
      if ( err ) {
        throw new Error(err)
      }

      if ( !self.id ) {
        self.id = data.objectId
        self.isNew = false
      }

      callback && callback.call(self, err, data)
    })

    return self
  }

}, events)




module.exports = Obj