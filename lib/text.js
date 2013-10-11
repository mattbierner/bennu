/*
 * THIS FILE IS AUTO GENERATED from 'lib/text.kep'
 * DO NOT EDIT
*/
define((function(require, exports, module) {
    "use strict";
    var character, string, trie, match, anyChar, letter, space, digit;
    var __a = require("parse/parse"),
        always = __a["always"],
        attempt = __a["attempt"],
        choicea = __a["choicea"],
        ExpectError = __a["ExpectError"],
        next = __a["next"],
        Parser = __a["Parser"],
        token = __a["token"];
    var reduce = Function.prototype.call.bind(Array.prototype.reduce);
    var reduceRight = Function.prototype.call.bind(Array.prototype.reduceRight);
    var expectError = (function(msg) {
        return (function(pos, tok) {
            return new ExpectError(pos, msg, ((tok === null) ? "end of input" : tok));
        });
    });
    var StringError = (function(position, string, index, expected, found) {
        ExpectError.call(this, position, expected, found);
        (this.string = string);
        (this.index = index);
    });
    (StringError.prototype = new ExpectError());
    (StringError.prototype.constructor = StringError);
    Object.defineProperty(StringError.prototype, "errorMessage", ({
        "get": (function() {
            return ((((((("In string:'" + this.string) + "' at index:") + this.index) + ", Expected:") + this.expected) + " Found:") + (this.found ? this.found : "end of input"));
        })
    }));
    var _character = (function(pred) {
        return (function(c, err) {
            return token(pred(c), err);
        });
    })((function pred(l) {
        return (function(x) {
            return (function(r) {
                return (x === r.valueOf());
            });
        })(l.valueOf());
    }));
    (character = (function(c) {
        return _character(c, expectError(c));
    }));
    (string = (function(reducer) {
        return (function(s) {
            return attempt(reduceRight(s, reducer, always(s)));
        });
    })((function reducer(p, c, i, s) {
        return next(_character(c, (function(pos, tok) {
            return new StringError(pos, s, i, c, tok);
        })), p);
    })));
    (trie = (function(wordReduce) {
        return (function(wordsReduce) {
            return (function(makeTrie) {
                return (function(_trie) {
                    return (function(words) {
                        return attempt(_trie(makeTrie(words), ""));
                    });
                })((function _trie(trie, prefix) {
                    return choicea(Object.keys(trie).sort().reverse().map((function(n) {
                        return ((n.length === 0) ? always(prefix) : attempt(next(character(n), _trie(trie[n], (prefix + n)))));
                    })));
                }));
            })((function makeTrie(words) {
                return reduce(words, wordsReduce, ({}));
            }));
        })((function wordsReduce(trie, word) {
            var node = reduce(word, wordReduce, trie);
            (node[""] = null);
            return trie;
        }));
    })((function wordReduce(parent, l) {
        (parent[l] = (parent[l] || ({})));
        return parent[l];
    })));
    (match = (function(pattern, expected) {
        return token(RegExp.prototype.test.bind(pattern), expectError(expected));
    }));
    (anyChar = Parser("Any Character", match(/^.$/, "any character")));
    (letter = Parser("Any Letter", match(/^[a-z]$/i, "any letter character")));
    (space = Parser("Any Whitespace", match(/^\s$/i, "any space character")));
    (digit = Parser("Any Digit", match(/^[0-9]$/i, "any digit character")));
    (exports.character = character);
    (exports.string = string);
    (exports.trie = trie);
    (exports.match = match);
    (exports.anyChar = anyChar);
    (exports.letter = letter);
    (exports.space = space);
    (exports.digit = digit);
}))