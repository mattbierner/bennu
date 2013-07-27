/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse_string.kep'
 * DO NOT EDIT
*/
;
define(["parse/parse", "nu/stream"], function(parse, stream) {
    "use strict";
    var reduce = Function.prototype.call.bind(Array.prototype.reduce);
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
    var string = function(impl) {
        return function(s) {
            return parse.bind(parse.getPosition(), function(pos) {
                return parse.attempt(impl(s, s, "", pos));
            }
            );
        }
        ;
    }
    (function impl(original, remaining, found, pos) {
        return ((remaining.length === 0) ? parse.always(original) : parse.next(parse.token(stringEq.bind(undefined, remaining[0]), function(_, tok) {
            return new parse.ExpectError(pos, original, ((tok === null) ? found : (found + tok)));
        }
        ), impl(original, remaining.slice(1), (found + remaining[0]), pos)));
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
