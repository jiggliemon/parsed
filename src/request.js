
var Parsed = require('./parsed')
var https = require('https')

function arrayToObject (array, val) {
  var result = {}, i=0
  while (i < array.length) {
      result[array[i]] = true;
      i++
    }
  return result
}

var illegalProperties = ["appId","jsKey","masterKey","_JavaScriptKey","_MasterKey","_ApplicationId","_method"]
var legalMethods = ["GET","POST","PUT","DELETE"]
var legalRoutes = ["classes","push","users","login","functions","requestPasswordReset","schemas"]
// todo:use [].indexOf
//      for now we'll just check for the existance of the key
var illegalPropertiesObj = arrayToObject(illegalProperties)
var legalMethodsObj = arrayToObject(legalMethods)
var legalRoutesObj = arrayToObject(legalRoutes)

var apiHost = "api.parse.com"
var apiVersion = 1

// todo:This will need to be dynamic.
//      I don't want to have this 
//      the API dynamicizm effect
      
var apiPathPrefix = "/"+apiVersion

function Request () {}


/**
 * @param {string} object
 * @param {string} method
 * @param {object} params
 * @param {function} callback
 * @return Request
 */
Request.send = function (route, object, method, params, callback) {
  method = method.toUpperCase() //
  route = route.toLowerCase() //
  object = object || '' //
  params = params || {} //

  if (!legalMethodsObj[method]) { //
    throw new Error('parsed cannot make a request using the `'+method+'` method.'); //
  } else if (!legalRoutesObj[route]) { //
    throw new Error('parsed cannot make a call to `'+route+'`') //
  } //

  var dataObj = {
     _JavaScriptKey: Parsed.config('Javascript Key')
    ,_ApplicationId: Parsed.config('Application ID')
    ,_method: method
    ,_ClientVersion: 'browser'
  }

  if (Parsed.config('Master Key')) {
    dataObj._MasterKey = Parsed.config('Master Key')
    dataObj._JavaScriptKey = undefined
  }

  // Add all the object legal properties
  // note: this won't copy any illegal properties over
  var payload = JSON.stringify(extend(dataObj, params))

  // this is to allow for /schema to be called
  // possibly others down the line, maybe /users?
  var path = [apiPathPrefix,route]
  if ( object ) {
    path.push(object)
  }

  var req = https.request({
     method: 'POST'
    ,hostname: apiHost
    ,path: path.join('/')
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
        callback(null, data, res)
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
legalMethods.forEach(function (method) {
  Request[method.toLowerCase()] = function (route, object, params, callback) {
    return Request.send(route, object,method,params,callback)
  }
})

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
