/*
 * THIS FILE IS AUTO GENERATED from 'lib/text.kep'
 * DO NOT EDIT
*/
;
define(["parse/parse"], function(parse) {
    "use strict";
    var reduce = Function.prototype.call.bind(Array.prototype.reduce);
    var reduceRight = Function.prototype.call.bind(Array.prototype.reduceRight);
    var expectError = function(msg) {
        return function(pos, tok) {
            return new parse.ExpectError(pos, msg, ((tok === null) ? "end of input" : tok));
        }
        ;
    }
    ;
    var StringError = function(position, string, index, expected, found) {
        parse.ExpectError.call(this, position, expected, found);
        (this.string = string);
        (this.index = index);
    }
    ;
    (StringError.prototype = new parse.ExpectError());
    (StringError.prototype.constructor = StringError);
    Object.defineProperty(StringError.prototype, "errorMessage", ({
        "get": function() {
            return ((((((("In string:'" + this.string) + "' at index:") + this.index) + ", Expected:") + this.expected) + " Found:") + (this.found ? this.found : "end of input"));
        }
        
    }));
    var _character = function(pred) {
        return function(c, err) {
            return parse.token(pred(c), err);
        }
        ;
    }
    (function pred(l) {
        return function(x) {
            return function(r) {
                return (x === r.valueOf());
            }
            ;
        }
        (l.valueOf());
    }
    );
    var character = function(c) {
        return _character(c, expectError(c));
    }
    ;
    var string = function(reducer) {
        return function(s) {
            return parse.attempt(reduceRight(s, reducer, parse.always(s)));
        }
        ;
    }
    (function reducer(p, c, i, s) {
        return parse.next(_character(c, function(pos, tok) {
            return new StringError(pos, s, i, c, tok);
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
                    return parse.choicea(Object.keys(trie).sort().reverse().map(function(n) {
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
    var match = function(pattern, expected) {
        return parse.token(RegExp.prototype.test.bind(pattern), expectError(expected));
    }
    ;
    var anyChar = parse.Parser("Any Character", match(/^.$/, "any character"));
    var letter = parse.Parser("Any Letter", match(/^[a-z]$/i, "any letter character"));
    var space = parse.Parser("Any Whitespace", match(/^\s$/i, "any space character"));
    var digit = parse.Parser("Any Digit", match(/^[0-9]$/i, "any digit character"));
    return ({
        "character": character,
        "string": string,
        "trie": trie,
        "match": match,
        "anyChar": anyChar,
        "letter": letter,
        "space": space,
        "digit": digit
    });
}
);
