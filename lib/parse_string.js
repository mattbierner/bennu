/**
 * @fileOverview Parsers for use specifically with strings.
 */
define(['parse'], function(parse) {
"use strict";

/* Prototypes
 ******************************************************************************/
var regExpTest = RegExp.prototype.test;

/* Exported Objects
 ******************************************************************************/
/**
 * Parser that consumes a given character. 
 * 
 * Unboxes string Objects
 * 
 * @param c The char to consume.
 */
var charParser = function(c) {
    return parse.token(function(token) {
        return (c.toString() === token.toString());
    });
};

/**
 * Parser that consumes a given string.
 * 
 * @param {String} s String to consume.
 */
var stringParser = function(s) {
    return map.call(s, charParser)
        .concat(alwaysParser(s))
        .reduce(nextParser);
};

/**
 * Parser that consumes any character.
 */
var anyCharParser = parse.token(regExpTest.bind(/^.$/));

/**
 * Parser that consumes any letter character.
 * 
 */
var letterParser = parse.token(regExpTest.bind(/^[a-z]$/i));

/**
 * Parser that consumes any space character.
 * 
 */
var spaceParser = parse.token(regExpTest.bind(/^\s$/i));

/**
 * Parser that consumes any number character.
 */
var digitParser = parse.token(regExpTest.bind(/^[0-9]$/i));

/* Export
 ******************************************************************************/
return {
// Parsers
    'char': charParser,
    'string': stringParser,
    'anyChar': anyCharParser,
    'letter': letterParser,
    'space': spaceParser,
    'digit': digitParser
};

});