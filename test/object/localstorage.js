var Obj = require('../../object')
var LocalStorage = require('../../object/localstorage')
var assert = require('assert')

describe('Object::localstorage', function () {
  var Task = Obj.create('Task', {
    implements: [LocalStorage]
  })
})