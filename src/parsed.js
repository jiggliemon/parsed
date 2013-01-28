var eventBehavior = require('yeah')

var Parse = {
  illegalProperties: ['updatedAt','createdAt']

  /**
   * @param {object} obj
   *
   */
  ,init: function (config) {
    this.config(config || {})
  }
  
  ,config: function (key, value, undef) {
    var self = this
    var config = self.config = self.config || {}

    if (typeof key !== 'string') {
      for(var k in key) {
        if (key.hasOwnProperty(k)) {
          self.config(k,key[k])
        }
      }
      return self
    }

    if (value === undef) {
      return config[key]
    }

    config[key] = value
    return self
  }

  /**
   * @param {object} obj
   *
   */
  ,clean: function (obj) {
    var result = {}
    for (var k in obj) {
      if (obj.hasOwnProperty(k) 
        && this.illegalProperties.indexOf(k) == -1) {
        result[k] = obj[k]
      }
    }
    return result
  }
}

eventBehavior(Parse)

module.exports = Parse