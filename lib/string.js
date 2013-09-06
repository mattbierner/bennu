/*
 * THIS FILE IS AUTO GENERATED from 'lib/string.kep'
 * DO NOT EDIT
*/
;
define(["parse/parse", "nu/stream"], function(parse, stream) {
    "use strict";
    var reduce = Function.prototype.call.bind(Array.prototype.reduce);
    var reduceRight = Function.prototype.call.bind(Array.prototype.reduceRight);
    var regExpTest = RegExp.prototype.test;
    var stringEq = function(a, b) {
        return (a.valueOf() === b.valueOf());
    }
    ;
    var expectError = function(msg) {
        return function(pos, tok) {
            return new parse.ExpectError(pos, msg, ((tok === null) ? "end of input" : tok));
        }
        ;
    }
    ;
    var character = function(c) {
        return parse.token(stringEq.bind(undefined, c), expectError(c));
    }
    ;
    var string = function(reducer) {
        return function(s) {
            return reduceRight(s, reducer, parse.always(s));
        }
        ;
    }
    (function reducer(p, c, i, s) {
        return parse.next(parse.token(stringEq.bind(undefined, c), function(pos, tok) {
            return new parse.ExpectError(pos, s, tok);
        }
        ), p);
    }
    );
    var trie = function(wordReduce) {
        return function(wordsReduce) {
            return function(makeTrie) {
                return function(_trie) {
                    return function(words) {
                        return parse.attempt(_trie(makeTrie(words), ""));
                    }
                    ;
                }
                (function _trie(trie, prefix) {
                    return parse.choice.apply(undefined, Object.keys(trie).sort().reverse().map(function(n) {
                        return ((n.length === 0) ? parse.always(prefix) : parse.attempt(parse.next(character(n), _trie(trie[n], (prefix + n)))));
                    }
                    ));
                }
                );
            }
            (function makeTrie(words) {
                return reduce(words, wordsReduce, ({}));
            }
            );
        }
        (function wordsReduce(trie, word) {
            var node = reduce(word, wordReduce, trie);
            (node[""] = null);
            return trie;
        }
        );
    }
    (function wordReduce(parent, l) {
        (parent[l] = (parent[l] || ({})));
        return parent[l];
    }
    );
    var anyChar = parse.Parser("Any Character", parse.token(regExpTest.bind(/^.$/), expectError("any character")));
    var letter = parse.Parser("Any Letter", parse.token(regExpTest.bind(/^[a-z]$/i), expectError("any letter character")));
    var space = parse.Parser("Any Whitespace", parse.token(regExpTest.bind(/^\s$/i), expectError("any space character")));
    var digit = parse.Parser("Any Digit", parse.token(regExpTest.bind(/^[0-9]$/i), expectError("any digit character")));
    return ({
        "character": character,
        "string": string,
        "trie": trie,
        "anyChar": anyChar,
        "letter": letter,
        "space": space,
        "digit": digit
    });
}
);
