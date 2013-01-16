var EventBehavior = require('yeah')

var Parse = {
   init: function (config) {
    this.config(config || {})
  }
  ,config: function (key, value, undef) {
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

EventBehavior(Parse)

module.exports = Parse