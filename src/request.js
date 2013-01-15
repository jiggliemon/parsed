
var https = require('https')

var illegalProperties = ["appId","jsKey","masterKey","_JavaScriptKey","_MasterKey","_ApplicationId","_method"]
var allowedMethods = ["GET","POST","PUT","DELETE"]
var allowedRoutes = ["classes","push","users","login","functions","requestPasswordReset"]
// todo:use [].indexOf
//      for now we'll just check for the existance of the key
var illegalPropertiesObj = arrayToObject(illegalProperties)
var allowedMethodsObj = arrayToObject(allowedMethods)
var allowedRoutesObj = arrayToObject(allowedRoutes)

var apiHost = "api.parse.com"
var apiVersion = 1

// todo:This will need to be dynamic.
//      I don't want to have this 
//      the API dynamicizm effect
        
var apiPathPrefix = "/"+apiVersion+"/classes/"

function Request () {}


/**
 * @param {string} object
 * @param {string} method
 * @param {object} params
 * @param {function} callback
 * @return Request
 */
Request.send = function (object, method, params, callback) {
  method = method.toUpperCase()
  params = params || {}

  if (!allowedMethodsObj[method]) {
    throw new Error('parsed cannot make a request using the `'+method+'` method.');
  }

  var dataObj = {
     _JavaScriptKey: params.jsKey
    ,_ApplicationId: params.appId
    ,_method: method
  }

  if (params.masterKey) {
    dataObj._MasterKey = params.masterKey
    dataObj._JavaScriptKey = undefined
  }

  // Add all the object properties
  // this won't add any illegal properties
  var payload = JSON.stringify(extend(dataObj, params))

  var req = https.request({
     method: 'POST'
    ,hostname: apiHost
    ,path: apiPathPrefix+object
    ,headers: {
       "Content-Type":"text/plain"
      ,"Content-Length":payload.length
    }
  }, function (res) {
    res.setEncoding('utf8')
    res.on('data', function (chunk) {
      var data = JSON.parse(chunk)
      if (callback && data.error) {
        callback(data)
      } else {
        callback(null, data)
      }
    })
  })

  req.on('error', callback)
  req.write(payload)
  req.end()

  return req
}



// This will create our .post,.get,.put,.delete methods
// they just map to .send w/ the method pre-populated
allowedMethods.forEach(function (method) {
  Request[method.toLowerCase()] = function (object, params, callback) {
    return Request.send(object,method,params,callback)
  }
})


function arrayToObject (array, val) {
  var result = {}, i=0
  while ( i < array.length) { 
    result[array[i]] = true; 
    i++
  }
  return result
}

function extend (obj) {
  var i = 1
  while (arguments[i]) {
    var arg = arguments[i]
    for (var k in arg) {
      if (arg.hasOwnProperty(k) && !illegalPropertiesObj[k]) {
        obj[k] = arg[k]
      }
    }
    i++
  }
  return obj
}


module.exports = Request
