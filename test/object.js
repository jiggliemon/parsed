var assert = require('assert')
var test = require('../test')
var Obj = require('../object')

describe('Object', function () {
  var Task = new Obj.create('Task', {
    defaults: {
       'description': 'Nothing to see here'
      ,'doneness': false
    }
  })

  var task = new Task({
    description: 'Get laundry'
  })

  describe('#save', function () {
    it('should save without error', function (done) {
      task.save(function (err, data) {
        if (err) throw new Error
        done()
      })
    })
  })

  describe('#update', function () {
    it('should update a persisted object', function (done) {
      console.log(task.id)
      task.setData({
        'doneness': true
        ,'description':'Gotted laundry'
      }).update(function (err, data) {
        if (err) throw new Error
        console.log(data)
        done()
      })
    })
  })

})