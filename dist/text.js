/*
 * THIS FILE IS AUTO GENERATED from 'lib/text.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "./parse"], (function(require, exports, __o) {
    "use strict";
    var always = __o["always"],
        attempt = __o["attempt"],
        bind = __o["bind"],
        either = __o["either"],
        ExpectError = __o["ExpectError"],
        next = __o["next"],
        Parser = __o["Parser"],
        token = __o["token"];
    var character, characters, string, trie, match, anyChar, letter, space, digit;
    var join = Function.prototype.call.bind(Array.prototype.join);
    var map = Function.prototype.call.bind(Array.prototype.map);
    var reduce = Function.prototype.call.bind(Array.prototype.reduce);
    var reduceRight = Function.prototype.call.bind(Array.prototype.reduceRight);
    var expectError = (function(msg) {
        return (function(pos, tok) {
            return new(ExpectError)(pos, msg, ((tok === null) ? "end of input" : tok));
        });
    });
    var StringError = (function(position, string, index, expected, found) {
        ExpectError.call(this, position, expected, found);
        (this.string = string);
        (this.index = index);
    });
    (StringError.prototype = new(ExpectError)());
    (StringError.prototype.constructor = StringError);
    Object.defineProperty(StringError.prototype, "errorMessage", ({
        "get": (function() {
            return ((((((("In string:'" + this.string) + "' at index:") + this.index) +
                ", Expected:") + this.expected) + " Found:") + (this.found ? this.found :
                "end of input"));
        })
    }));
    var _character = (function() {
        var pred = (function(l) {
            var x = l.valueOf();
            return (function(r) {
                return (x === r.valueOf());
            });
        });
        return (function(c, err) {
            return token(pred(c), err);
        });
    })
        .call(this);
    (character = (function(c) {
        return _character(c, expectError(c));
    }));
    (characters = (function(chars) {
        var lookup = map(chars, (function(x) {
            return x.valueOf();
        })),
            pred = (function(r) {
                return (lookup.indexOf(r.valueOf()) !== -1);
            });
        return token(pred, expectError(join(chars, " or ")));
    }));
    (string = (function() {
            var reducer = (function(p, c, i, s) {
                return next(_character(c, (function(pos, tok) {
                    return new(StringError)(pos, s, i, c, tok);
                })), p);
            });
            return (function(s) {
                return attempt(reduceRight(s, reducer, always((s + ""))));
            });
        })
        .call(this));
    (trie = (function() {
            var wordReduce = (function(parent, l) {
                (parent[l] = (parent[l] || ({})));
                return parent[l];
            }),
                wordsReduce = (function(trie, word) {
                    var node = reduce(word, wordReduce, trie);
                    (node[""] = word);
                    return trie;
                }),
                makeTrie = (function(words) {
                    return reduce(words, wordsReduce, ({}));
                }),
                _trie = (function(trie) {
                    var keys = Object.keys(trie),
                        paths = reduce(keys, (function(p, c) {
                            if (c.length)(p[c] = _trie(trie[c]));
                            return p;
                        }), ({})),
                        select = attempt(bind(characters(keys), (function(x) {
                            return paths[x];
                        })));
                    return (trie.hasOwnProperty("") ? either(select, always(trie[""])) : select);
                });
            return (function(words) {
                return attempt(_trie(makeTrie(words), ""));
            });
        })
        .call(this));
    (match = (function(pattern, expected) {
        return token(RegExp.prototype.test.bind(pattern), expectError(expected));
    }));
    (anyChar = Parser("Any Character", match(/^.$/, "any character")));
    (letter = Parser("Any Letter", match(/^[a-z]$/i, "any letter character")));
    (space = Parser("Any Whitespace", match(/^\s$/i, "any space character")));
    (digit = Parser("Any Digit", match(/^[0-9]$/i, "any digit character")));
    (exports.character = character);
    (exports.characters = characters);
    (exports.string = string);
    (exports.trie = trie);
    (exports.match = match);
    (exports.anyChar = anyChar);
    (exports.letter = letter);
    (exports.space = space);
    (exports.digit = digit);
}));