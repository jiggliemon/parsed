'use strict'

// Check for window or global
var win;
if (typeof window != 'undefined') {
    win = window
} else {
    win = global
}

var store = win.localStorage

/**
 * LocalStorage plugin for parsed/object
 */
function LS(){}

LS.prototype = {
    listeners: {
        'saved': 'save'
    }

    , save: function(key, data){
        store && store.setItem(key, JSON.stringify(data))
        return this
    }

    , fetch: function(key){
        return store && JSON.parse(store.getItem(key))
    }
}

module.exports = LS