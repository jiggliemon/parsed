var assert = require('assert')
var request = require('../src/request')
var Parse = require('../src/main')


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

var parse = Parse.create({
  appId: "qCJ9D21uYQCdYsCqdXCZsDbSaUDEjXiZzOFnpjt9",
  jsKey: "0Yzd9XKNmgnyGSG70kpIc6SP2T3OMziL9YUIHP2B"
})

var Thing = {
  name: "Hello"
}

describe('request', function () {

  describe('#send', function () {
    it('should successfully authenticate with parse.com', function (done) {

      request.send('Thing', 'POST', extend({
         appId:parse.config('appId')
        ,jsKey: parse.config('jsKey')
      }, Thing, {method: 'send'}), function (err, data) {

        if (err) {
          throw new Error(err.message)
          return
        }

        console.log(data.objectId)
        done()
      })
    })
  })

  describe('#post', function () {
    it('should ping parse.com', function (done) {
      request.post('Thing', extend({
         appId:parse.config('appId')
        ,jsKey: parse.config('jsKey')
      },Thing, {method: "post"}), function (err, data) {
        if (err) {
          throw new Error(err.message)
          return
        }
        console.log(data.objectId)
        done()
      })
    })
  })

})