"use strict";

var buster = require('buster')
var assert = buster.assertions.assert
var refute = buster.assertions.refute
var expect = buster.assertions.expect

buster.testCase('Parsed', {
    setUp: function(){},

    tearDown: function(){},

    'Parsed test': function(){
        assert(true)
    },

    'Parsed async': function(done){
        (function(){
            assert(true)
            done()
        })()
    }
})
