var events = require('yeah/mixin')


function extend (dest) {
  while (arguments[1]) {
    extend
  }
}

/**
 * Constructor 
 */
function Obj (name, methods) {

}

/**
 * Static Methods 
 */
Obj.create = function (/* String, Object */ name, /* Object */ methods) {
  return new Obj( name, methods )
}


/**
 * Prototype Methods 
 */
extend(Obj.prototype, {
   init: function (dataOrId) {}
  ,save: function () {}
}, events)




module.exports = Obj;