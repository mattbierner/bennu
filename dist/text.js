/*
 * THIS FILE IS AUTO GENERATED from 'lib/text.kep'
 * DO NOT EDIT
*/define(["require", "exports", "./parse"], (function(require, exports, __o) {
    "use strict";
    var character, oneOf, noneOf, string, trie, match, anyChar, letter, space, digit, always = __o["always"],
        attempt = __o["attempt"],
        bind = __o["bind"],
        optional = __o["optional"],
        ExpectError = __o["ExpectError"],
        next = __o["next"],
        label = __o["label"],
        token = __o["token"],
        join = Function.prototype.call.bind(Array.prototype.join),
        map = Function.prototype.call.bind(Array.prototype.map),
        reduce = Function.prototype.call.bind(Array.prototype.reduce),
        reduceRight = Function.prototype.call.bind(Array.prototype.reduceRight),
        StringError = (function(position, string, index, expected, found) {
            var self = this;
            ExpectError.call(self, position, expected, found);
            (self.string = string);
            (self.index = index);
        });
    (StringError.prototype = new(ExpectError)());
    (StringError.prototype.constructor = StringError);
    Object.defineProperty(StringError.prototype, "errorMessage", ({
        "get": (function() {
            var self = this;
            return ((((((("In string: '" + self.string) + "' at index: ") + self.index) +
                ", Expected: ") + self.expected) + " Found: ") + (self.found ? self.found :
                "end of input"));
        })
    }));
    var unbox = (function(y) {
        return ("" + y);
    }),
        _character = (function(c, err) {
            var x;
            return token(((x = ("" + c)), (function(r) {
                return (x === ("" + r));
            })), err);
        });
    (character = (function(c) {
        return _character(c, (function(pos, tok) {
            return new(ExpectError)(pos, c, ((tok === null) ? "end of input" : tok));
        }));
    }));
    (oneOf = (function(chars) {
        var chars0 = map(chars, unbox),
            msg;
        return token((function(x) {
            return (chars0.indexOf(("" + x)) >= 0);
        }), ((msg = join(chars0, " or ")), (function(pos, tok) {
            return new(ExpectError)(pos, msg, ((tok === null) ? "end of input" : tok));
        })));
    }));
    (noneOf = (function(chars) {
        var chars0 = map(chars, unbox),
            msg;
        return token((function(z) {
            var x = (chars0.indexOf(("" + z)) >= 0);
            return (!x);
        }), ((msg = ("none of:" + join(chars0, " or "))), (function(pos, tok) {
            return new(ExpectError)(pos, msg, ((tok === null) ? "end of input" : tok));
        })));
    }));
    var reducer = (function(p, c, i, s) {
        return next(_character(c, (function(pos, tok) {
            return new(StringError)(pos, s, i, c, tok);
        })), p);
    });
    (string = (function(s) {
        return attempt(reduceRight(s, reducer, always(("" + s))));
    }));
    var wordReduce = (function(parent, l) {
        (parent[l] = (parent[l] || ({})));
        return parent[l];
    }),
        wordsReduce = (function(trie, word) {
            var node = reduce(word, wordReduce, trie);
            (node[""] = word);
            return trie;
        }),
        _trie = (function(trie) {
            var keys = Object.keys(trie),
                paths = reduce(keys, (function(p, c) {
                    if (c) {
                        (p[c] = _trie(trie[c]));
                    }
                    return p;
                }), ({})),
                select = attempt(bind(oneOf(keys), (function(y) {
                    return paths[y];
                })));
            return (trie.hasOwnProperty("") ? optional(trie[""], select) : select);
        });
    (trie = (function(z) {
        var z0 = reduce(z, wordsReduce, ({})),
            keys, paths, select;
        return attempt(((keys = Object.keys(z0)), (paths = reduce(keys, (function(p, c) {
            if (c) {
                (p[c] = _trie(z0[c]));
            }
            return p;
        }), ({}))), (select = attempt(bind(oneOf(keys), (function(y) {
            return paths[y];
        })))), (z0.hasOwnProperty("") ? optional(z0[""], select) : select)));
    }));
    (match = (function(pattern, expected) {
        return token(RegExp.prototype.test.bind(pattern), (function(pos, tok) {
            return new(ExpectError)(pos, expected, ((tok === null) ? "end of input" : tok));
        }));
    }));
    var pattern;
    (anyChar = label("Any Character", ((pattern = /^.$/), token(RegExp.prototype.test.bind(pattern), (function(
        pos, tok) {
        return new(ExpectError)(pos, "any character", ((tok === null) ? "end of input" :
            tok));
    })))));
    var pattern0;
    (letter = label("Any Letter", ((pattern0 = /^[a-z]$/i), token(RegExp.prototype.test.bind(pattern0), (
        function(pos, tok) {
            return new(ExpectError)(pos, "any letter character", ((tok === null) ?
                "end of input" : tok));
        })))));
    var pattern1;
    (space = label("Any Whitespace", ((pattern1 = /^\s$/i), token(RegExp.prototype.test.bind(pattern1), (
        function(pos, tok) {
            return new(ExpectError)(pos, "any space character", ((tok === null) ?
                "end of input" : tok));
        })))));
    var pattern2;
    (digit = label("Any Digit", ((pattern2 = /^[0-9]$/i), token(RegExp.prototype.test.bind(pattern2), (function(
        pos, tok) {
        return new(ExpectError)(pos, "any digit character", ((tok === null) ?
            "end of input" : tok));
    })))));
    (exports["character"] = character);
    (exports["oneOf"] = oneOf);
    (exports["noneOf"] = noneOf);
    (exports["string"] = string);
    (exports["trie"] = trie);
    (exports["match"] = match);
    (exports["anyChar"] = anyChar);
    (exports["letter"] = letter);
    (exports["space"] = space);
    (exports["digit"] = digit);
}));