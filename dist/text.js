/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/text.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "./parse"], (function(require, exports, __o) {
    "use strict";
    var always = __o["always"],
        attempt = __o["attempt"],
        bind = __o["bind"],
        either = __o["either"],
        expected = __o["expected"],
        ExpectError = __o["ExpectError"],
        next = __o["next"],
        label = __o["label"],
        token = __o["token"],
        character, oneOf, noneOf, string, trie, match, anyChar, letter, space, digit, join = Function.prototype
            .call.bind(Array.prototype.join),
        map = Function.prototype.call.bind(Array.prototype.map),
        reduce = Function.prototype.call.bind(Array.prototype.reduce),
        reduceRight = Function.prototype.call.bind(Array.prototype.reduceRight),
        StringError = (function(position, string, index, expected0, found) {
            var self = this;
            ExpectError.call(self, position, expected0, found);
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
        var msg, chars0 = map(chars, unbox);
        return token((function(x) {
            return (chars0.indexOf(("" + x)) >= 0);
        }), ((msg = join(chars0, " or ")), (function(pos, tok) {
            return new(ExpectError)(pos, msg, ((tok === null) ? "end of input" : tok));
        })));
    }));
    (noneOf = (function(chars) {
        var msg, chars0 = map(chars, unbox);
        return token((function(x) {
            var x0 = (chars0.indexOf(("" + x)) >= 0);
            return (!x0);
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
                    if (c.length) {
                        (p[c] = _trie(trie[c]));
                    }
                    return p;
                }), ({})),
                select = attempt(bind(oneOf(keys), (function(y) {
                    return paths[y];
                })));
            return (trie.hasOwnProperty("") ? either(select, always(trie[""])) : select);
        });
    (trie = (function(words) {
        var trie0, keys, paths, select;
        return attempt(((trie0 = reduce(words, wordsReduce, ({}))), (keys = Object.keys(trie0)), (paths =
            reduce(keys, (function(p, c) {
                if (c.length) {
                    (p[c] = _trie(trie0[c]));
                }
                return p;
            }), ({}))), (select = attempt(bind(oneOf(keys), (function(y) {
            return paths[y];
        })))), (trie0.hasOwnProperty("") ? either(select, always(trie0[""])) : select)));
    }));
    (match = (function(pattern, expected0) {
        return token(RegExp.prototype.test.bind(pattern), (function(pos, tok) {
            return new(ExpectError)(pos, expected0, ((tok === null) ? "end of input" : tok));
        }));
    }));
    (anyChar = label("Any Character", match(/^.$/, "any character")));
    (letter = label("Any Letter", match(/^[a-z]$/i, "any letter character")));
    (space = label("Any Whitespace", match(/^\s$/i, "any space character")));
    (digit = label("Any Digit", match(/^[0-9]$/i, "any digit character")));
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