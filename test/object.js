var assert = require('assert')
var test = require('../test')
var Obj = require('../src/object')

describe('Object', function () {
  var Task = new Obj.create('Task', {})
  var task
  beforeEach(function () {
    task = new Task
  })

  describe('#save', function () {
    
    it('should save successfully', function (done) {

      task.save(function (err, data) {
        if (err) throw new Error

        done()
      })
    })
  })

})