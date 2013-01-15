var yeah = require('yeah')

function Parse (config) {
  this.config(config)

  // extend the returned object with
  // event handling methods
  yeah(this)
}

var proto = {
  config: function (key, value, undef) {
    var config = this.config = this.config || {}

    if (typeof key !== 'string') {
      for(var k in key) {
        if (key.hasOwnProperty(k)) {
          this.config(k,key[k])
        }
      }
      return this
    }

    if (value === undef) {
      return config[key]
    }

    config[key] = value
    return this
  }
}

Parse.prototype = proto

Parse.create = function (appKey, jsKey) {
  return new Parse(appKey, jsKey)
}

module.exports = Parse