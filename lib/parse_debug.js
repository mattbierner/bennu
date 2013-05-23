/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse_debug.kep'
 * DO NOT EDIT
*/
define(["parse/parse", "nu/stream"], function(parse, stream) {
    "use strict";
    var compose = function(f, g) {
        return function() {
            return f(g.apply(undefined, arguments));
        }
        ;
    }
    ;
    var toArrayParser = function() {
        var toArray = function(x) {
            return parse.always(stream.toArray(x));
        }
        ;
        return function(p) {
            return parse.bind(p, toArray);
        }
        ;
    }
    ();
    var memoParser = function(p) {
    }
    ;
    return ({});
}
);
