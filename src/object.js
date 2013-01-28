var events = require('yeah/mixin')
var request = require('./request')
var parsed = require('./parsed')

function extend (obj) {
  var i = 1,k,arg
  while (arguments[i]) {
    arg = arguments[i]
    for (k in arg) {
      if (arg.hasOwnProperty(k)) {
        obj[k] = arg[k]
      }
    }
    i++
  }
  return obj
}

/**
 * Constructor 
 */
function Obj (name, methods) {
  this.name = name
  extend(this,methods)
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
extend(Obj.prototype, {

  /**
   *
   *
   */
  ,init: function (dataOrId) {
    var self = this
    if (typeof dataOrId === 'string') {
      seld.setId(dataOrId)
      
    }
  }

  ,config: parsed.config
  
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
  }
}, events)




module.exports = Obj;