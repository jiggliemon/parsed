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

  describe('#setData', function () {
    task.addEvent('data.set', function (key, value) {
      task.fireEvent('data.set.'+key, value)
    })

    it('should accept two arguments. Key/Value', function () {
      task.setData('key', 'value')
      assert(task.getData('key'), 'value')
    })

    it('should accept one argument. An object of key/values.', function () {
      task.setData({
        'one': 1
        ,'two': 2
      })
      assert.equal(task.getData('one'), 1)
      assert.equal(task.getData('two'), 2)
    })

    it('should fire an event.  The two arguments should be a key and updated value.', function () {
      task.addEvent('data.set.baz', function (val) {
        assert.equal(val, 1)
      })
      task.setData('foo', 'bar')
    })
  })
  describe('#save', function () {
    
    it('should save without error', function (done) {
      task.save(function (err, data) {
        if (err) throw new Error(err)
        done()
      })
    })

    it('should update a previously persisted object', function (done) {
      task.setData({
         'doneness': true
        ,'description':'Laundry gotted.'
      }).save(function (err, data) {
        if (err) throw new Error(err)
        done()
      })
    })
  })



})