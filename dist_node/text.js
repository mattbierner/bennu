/*
 * THIS FILE IS AUTO GENERATED from 'lib/text.kep'
 * DO NOT EDIT
*/"use strict";
var __o = require("./parse"),
    always = __o["always"],
    attempt = __o["attempt"],
    bind = __o["bind"],
    either = __o["either"],
    ExpectError = __o["ExpectError"],
    next = __o["next"],
    label = __o["label"],
    token = __o["token"],
    character, oneOf, noneOf, string, trie, match, anyChar, letter, space, digit, pred, join = Function.prototype.call.bind(
        Array.prototype.join),
    map = Function.prototype.call.bind(Array.prototype.map),
    reduce = Function.prototype.call.bind(Array.prototype.reduce),
    reduceRight = Function.prototype.call.bind(Array.prototype.reduceRight),
    expectError = (function(msg) {
        return (function(pos, tok) {
            return new(ExpectError)(pos, msg, ((tok === null) ? "end of input" : tok));
        });
    }),
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
        return ((((((("In string:'" + self.string) + "' at index:") + self.index) + ", Expected:") + self.expected) +
            " Found:") + (self.found ? self.found : "end of input"));
    })
}));
var _character = ((pred = (function(l) {
    var x = l.valueOf();
    return (function(r) {
        return (x === r.valueOf());
    });
})), (function(c, err) {
    return token(pred(c), err);
}));
(character = (function(c) {
    return _character(c, expectError(c));
}));
(oneOf = (function(chars) {
    var lookup = map(chars, (function(x) {
        return x.valueOf();
    })),
        pred = (function(r) {
            return (lookup.indexOf(r.valueOf()) >= 0);
        });
    return token(pred, expectError(join(chars, " or ")));
}));
(noneOf = (function(chars) {
    var lookup = map(chars, (function(x) {
        return x.valueOf();
    })),
        pred = (function(r) {
            return (lookup.indexOf(r.valueOf()) === -1);
        });
    return token(pred, expectError(("none of:" + join(chars, " or "))));
}));
var reducer = (function(p, c, i, s) {
    return next(_character(c, (function(pos, tok) {
        return new(StringError)(pos, s, i, c, tok);
    })), p);
});
(string = (function(s) {
    return attempt(reduceRight(s, reducer, always((s + ""))));
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
    makeTrie = (function(words) {
        return reduce(words, wordsReduce, ({}));
    }),
    _trie = (function(trie) {
        var keys = Object.keys(trie),
            paths = reduce(keys, (function(p, c) {
                if (c.length)(p[c] = _trie(trie[c]));
                return p;
            }), ({})),
            select = attempt(bind(oneOf(keys), (function(x) {
                return paths[x];
            })));
        return (trie.hasOwnProperty("") ? either(select, always(trie[""])) : select);
    });
(trie = (function(words) {
    return attempt(_trie(makeTrie(words), ""));
}));
(match = (function(pattern, expected) {
    return token(RegExp.prototype.test.bind(pattern), expectError(expected));
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