/**
 * @fileOverview Parsers for use specifically with strings.
 */
define(['parse/parse'], function(parse) {
"use strict";

/* Prototypes
 ******************************************************************************/
var reduce = Array.prototype.reduce;

var regExpTest = RegExp.prototype.test;

/* Helpers
 ******************************************************************************/
var stringEq = function(a, b) {
    return (a.toString() === b.toString());
};

/* Parsers
 ******************************************************************************/
/**
 * Parser that consumes a given character. 
 * 
 * Unboxes string Objects
 * 
 * @param c The char to consume.
 */
var charParser = function(c) {
    return parse.character(c, stringEq);
};

/**
 * Parser that consumes a given string.
 * 
 * @param {String} s String to consume.
 */
var stringParser = function(s) {
    return parse.string(s, stringEq);
};

/**
 * Parser that builds a parse trie from an array of strings.
 */
var trieParser = (function(){
    var wordReduce = function(parent, l) {
        return (parent[l] = (parent[l] || {}));
    };
    
    var wordsReduce = function(trie, word) {
        var node = reduce.call(word, wordReduce, trie);
        node[''] = null;
        return trie;
    };
    
    var makeTrie = function(words) {
        return words.reduce(wordsReduce, {});
    };
    
    var _trie = function(trie, prefix) {
        var choices = [];
        for (var n in trie) {
            if (n.length === 1) {
                choices.push(parse.attempt(parse.next(
                    charParser(n),
                    _trie(trie[n], prefix + n))));
            }
        }
        
        if (trie.hasOwnProperty('')) {
            choices.push(parse.always(prefix));
        }
        
        return parse.choice.apply(undefined, choices);
    };
    
    return function(nodes) {
        return _trie(makeTrie(nodes), '');
    };
}());

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
    'character': charParser,
    'string': stringParser,
    'trie': trieParser,
    
    'anyChar': anyCharParser,
    'letter': letterParser,
    'space': spaceParser,
    'digit': digitParser
};

});