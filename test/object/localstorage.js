var Obj = require('../../object')
var LocalStorage = require('../../object/localstorage')
var assert = require('assert')

describe('Object::localstorage', function () {
  var Task = Obj.create('Task', {
    implements: [LocalStorage]
  })
  var task = new Task({
    doneness: true
  })

  it('should persist the data localy', function () {
    // I don't know how to write tests for this.
    // I might need to write these for the client
  })

})