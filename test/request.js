var assert = require('assert')
var request = require('../src/request')
var Parse = require('../src/parsed')


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

Parse.init({
   "Application ID": "qCJ9D21uYQCdYsCqdXCZsDbSaUDEjXiZzOFnpjt9"
  ,"Javascript Key": "0Yzd9XKNmgnyGSG70kpIc6SP2T3OMziL9YUIHP2B"
  ,"Master Key":"Vc88b1GvdGy5XhPnC7vBgsqdTSZGHWsAqXqDhnnj"
})


var responses = []

describe('request', function () {
  /* 
    This /schemas endpoint is undocumented.
    Im using it just to clean up the test env
  */
  after(function (done) {
    request.send('schemas','Thing','DELETE', {}, function (err, res) {
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