var assert = require('assert')
var test = require('../test')
var request = require('../util/request')


function extend (obj) {
  var i = 1
  while (arguments[i]) {
    var arg = arguments[i]
    for (var k in arg) {
      if (arg.hasOwnProperty(k)) {
        obj[k] = arg[k]
      }
    }
    i++
  }
  return obj
}

var responses = []



describe('request', function () {

  /* 
    This /schemas endpoint is undocumented.
    Im using it just to clean up the test env
  */
  after(function (done) {
    request.delete('schemas','Thing', {}, function (err, res) {
      done()
    })
  })

  describe('#send', function () {
    it('should successfully authenticate with parse.com', function (done) {
      var ThingOne = {
         name: "Thing One"
        ,optional: ""
      }

      request.send('classes','Thing', 'POST', ThingOne, function (err, data) {
        if (err) {
          throw new Error(err.message); return
        }

        responses.push(data)
        done()
      })
    })
  })

  describe('#post', function () {
    it('should ping parse.com', function (done) {
      request.post('classes','Thing', {
               name: "Thing Two"
              ,optional:""
            }, function (err, data) {

        if (err) {
          throw new Error(err.message); 
          return
        }
        responses.push(data)
        done()
      })
    })
  })

  describe('#get', function () {
    it('should retrieve a previously saved object', function (done) {
      request.get('classes','Thing/'+responses[0].objectId, null, function (err, data, res) {
        if (err) {
          throw new Error(err.message); 
          return
        }
        done()
      })
    })
  })

  describe('#put', function () {
    it('should update an existing object', function (done) {
      request.put('classes','Thing/'+responses[0].objectId, {optional:"Heyo!"}, function (err, data, res) {
        if (err) {
          throw new Error(err.message); 
          return
        }
        done()
      })
    })
  })

})