
var Obj = require('parsed/object')

var Poll = Obj.create('Poll', {
  init: (dataOrId) {
    var type = typeof dataOrId
    
    switch (type) {
      case "string":
        break;
      
      case "undefined":
        break;

      default:
        dataOrId && this.data(dataOrId)
        break;
    }

  }
})

module.exports = Poll