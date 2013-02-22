var Obj = require('../../object')
var Validation = require('../../object/validation')
var assert = require('assert')

describe('Object::localstorage', function () {
  var Task = Obj.create('Task', {
    implements: [Validation]
    ,rules: {
      "doneness": {
         rule: function (val) {
          return typeof val == 'boolean'
        }
        ,message: "Doneness must be either true or false"
      }
    }
  })

  var task = new Task({
    doneness: true
  })

  it('should persist the data localy', function () {
    // I don't know how to write tests for this.
    // I might need to write these for the client
  })

})