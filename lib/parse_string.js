/* THIS FILE IS AUTO GENERATED from lib/parse_string.kep
 * DO NOT EDIT*/

define(["parse/parse", "stream/stream"], function(parse, stream) {
    "use strict";
    var map = Array.prototype.map;
    var reduce = Array.prototype.reduce;
    var reduceRight = Array.prototype.reduceRight;
    var regExpTest = RegExp.prototype.test;
    var eq = function(a, b) {
        return (a === b);
    };
    var stringEq = function(a, b) {
        return (a.valueOf() === b.valueOf());
    };
    var tokenParser = function(consume, msg) {
        return function TOKEN_PARSER(state, m, cok, cerr, eok, eerr) {
            var pos = state.pos,input = state.input;
            if(!input){
                return eerr(new parse.UnexpectError(pos, "end of input"), state, m);
            }
            else{
                var tok = stream.first(input);
                return (consume(tok) ? cok(tok, state.next(tok), m) : eerr(new parse.ExpectError(pos, (((msg + ' Found: "') + tok) + '"')), state, m));
            }
        };
    };
    var charParser = function(c) {
        return tokenParser(stringEq.bind(undefined, c), (('"' + c) + '"'));
    };
    var stringParser = function() {
        var reducer = function(p, c) {
            return parse.next(c, p);
        };
        return function(s) {
            return map.call(s, charParser).reduceRight(reducer, parse.always(s));
        };
    }();
    var trieParser = function() {
        var wordReduce = function(parent, l) {
            return (parent[l] = (parent[l] || {}));
        };
        var wordsReduce = function(trie, word) {
            var node = reduce.call(word, wordReduce, trie);
            (node[""] = null);
            return trie;
        };
        var makeTrie = function(words) {
            return words.reduce(wordsReduce, {});
        };
        var _trie = function(trie, prefix) {
            var choices = [];
            Object.keys(trie).forEach(function(n) {
                if((n.length === 1)){
                    choices.push(parse.attempt(parse.next(charParser(n), _trie(trie[n], (prefix + n)))));
                }
            });
            if(trie.hasOwnProperty("")){
                choices.push(parse.always(prefix));
            }
            return parse.choice.apply(undefined, choices);
        };
        return function(nodes) {
            return _trie(makeTrie(nodes), "");
        };
    }();
    var anyCharParser = tokenParser(regExpTest.bind(/^.$/), "any character");
    var letterParser = tokenParser(regExpTest.bind(/^[a-z]$/i), "any letter character");
    var spaceParser = tokenParser(regExpTest.bind(/^\s$/i), "any space character");
    var digitParser = tokenParser(regExpTest.bind(/^[0-9]$/i), "any digit character");
    return {character:charParser,string:stringParser,trie:trieParser,anyChar:anyCharParser,letter:letterParser,space:spaceParser,digit:digitParser};
});
