
var store = require('localstorage')

/**
 * LocalStorage plugin for parsed/object
 */
function LS () {}

LS.prototype = {
   listeners: {
     'after.save': 'save'
    ,'before.fetch': 'fetch'
  }

  /**
   *
   *
   */
  ,save: function (key, data) {
    store.setItem(this.id, JSON.stringify(this.getData()))
    console.log(store.getItem(this.id))
  }

  /**
   *
   *
   */
  ,fetch: function(key) {
    var persistedData = JSON.parse(store.getItem(this.id))
    this.setData(persistedData, null, true)
  }
}

module.exports = LS