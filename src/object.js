var events = require('yeah/mixin')
var request = require('./request')
var parsed = require('./parsed')

/**
 * Constructor 
 */
function Obj (name, methods) {
  this.name = name
  parsed.extend(this, methods)
}

/**
 * Static Methods 
 */
Obj.create = function (/* String, Object */ name, /* Object */ methods) {
  var ParsedObject = function () {}
  ParsedObject.prototype = new Obj( name, methods )
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
      
    }
    return self
  }

  ,config: parsed.config
  
  /**
   *
   *
   */
  ,getDelta: function () {
    return {}
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
    request.put('classes', self.name,self.id, self.getDelta(), function (err, data) {
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
    request.post('classes', self.name, self.getDelta(), function(err, data) {
      self.fireEvent('saved', err, data)
      callback && callback.call(self, err, data)
    })
    return self
  }
}, events)




module.exports = Obj;