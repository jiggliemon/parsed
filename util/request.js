
var Parsed = require('../parsed')
var XHR = require('./xhr')

function arrayToObject (array, val) {
  var result = {}, i=0
  while (i < array.length) {
    result[array[i]] = true
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
  callback = callback || function() {}
  var xhr = XHR()

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
  if ( object ) { path.push(object) }

  xhr.onreadystatechange = function(response) {
    var status = xhr.status
    if (xhr.readyState == 4) {
      if (handled) { return }
      handled = true
      if ( status >= 200 && status < 300 ) {
        try {
          response = JSON.parse(xhr.responseText)
        } catch (e) { callback && callback(e, xhr) }

        if (response) {
          callback && callback(null, response, xhr)
        }
      } else {
        console.log('blurg.  handle the error here.')
      }
    }
  }
  var url = apiHost + path.join('/')
  console.log(url)
  xhr.open('POST',url, true)
  xhr.setRequestHeader("Content-Type", "text/plain") // avoid pre-flight.
  xhr.send(payload)

  return xhr
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



/*
Parse._ajaxIE8 = function(method, url, data, success, error) {
    var promise = new Parse.Promise();
    var xdr = new XDomainRequest();
    xdr.onload = function() {
      var response;
      try {
        response = JSON.parse(xdr.responseText);
      } catch (e) {
        if (error) {
          error(xdr);
        }
        promise.reject(e);
      }
      if (response) {
        if (success) {
          success(response, xdr);
        }
        promise.resolve(response);
      }
    };
    xdr.onerror = xdr.ontimeout = function() {
      if (error) {
        error(xdr);
      }
      promise.reject(xdr);
    };
    xdr.onprogress = function() {};
    xdr.open(method, url);
    xdr.send(data);
    return promise;
  };

  Parse._ajax = function(method, url, data, success, error) {
    if (typeof(XDomainRequest) !== "undefined") {
      return Parse._ajaxIE8(method, url, data, success, error);
    }

    var promise = new Parse.Promise();
    var handled = false;

    var xhr = new Parse.XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (handled) {
          return;
        }
        handled = true;

        if (xhr.status >= 200 && xhr.status < 300) {
          var response;
          try {
            response = JSON.parse(xhr.responseText);
          } catch (e) {
            if (error) {
              error(xhr);
            }
            promise.reject(e);
          }
          if (response) {
            if (success) {
              success(response, xhr.status, xhr);
            }
            promise.resolve(response, xhr.status, xhr);
          }
        } else {
          if (error) {
            error(xhr);
          }
          promise.reject(xhr);
        }
      }
    };
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-Type", "text/plain");  // avoid pre-flight.
    xhr.send(data);
    return promise;
  };
  */