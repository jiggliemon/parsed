var XHR = (function(i,ins){
  ins = [
    function (http) {
      // http = require('xmlhttprequest').XMLHttpRequest
      return (function () {
        return new http()
      }())
    }
    ,function (){return new XMLHttpRequest}
    ,function (){return new XDomainRequest}
  ]
         
  return (function tryX() {
    while(ins.length){
     try { i = ins.pop(); i() } 
     catch(e) { tryX() }
     finally{ return i }
    }
  }())
}())

module.exports = XHR

