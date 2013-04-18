/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse_string.kep'
 * DO NOT EDIT
*/
define(["parse/parse", "nu/stream"], function(parse, stream) {
    "use strict";
    var map = Array.prototype.map;
    var reduce = Array.prototype.reduce;
    var reduceRight = Array.prototype.reduceRight;
    var regExpTest = RegExp.prototype.test;
    var stringEq = function(a, b) {
        return (a.valueOf() === b.valueOf());
    }
    ;
    var expectError = function(msg) {
        return function(pos, tok) {
            return new parse.ExpectError(pos, msg, tok);
        }
        ;
    }
    ;
    var bindParser = function(p, f) {
        return function BIND_PARSER(state, m, cok, cerr, eok, eerr) {
            var pcerr = function(x, state, m) {
                return f(x, state, m)(state, m, cok, cerr, eok, eerr);
            }
            ,peerr = function(x, state, m) {
                return f(x, state, m)(state, m, cok, cerr, eok, eerr);
            }
            ;
            return p(state, m, cok, pcerr, eok, peerr);
        }
        ;
    }
    ;
    var charParser = function(c) {
        return parse.token(stringEq.bind(undefined, c), expectError(c));
    }
    ;
    var stringParser = function() {
        var reducer = function(p, c) {
            return parse.next(c, p);
        }
        ;
        var r = function(so, s, f, fail) {
            return ((s.length === 0) ? parse.always(so) : bindParser(parse.bind(charParser(s[0]), function(x) {
                return r(so, s.slice(1), (f + x), fail);
            }
            ), function(x) {
                return parse.next(parse.always(), fail((f + x)));
            }
            ));
        }
        ;
        return function(s) {
            return r(s, s, "", function(str) {
                return parse.never(new parse.ExpectError(null, s, str));
            }
            );
        }
        ;
    }
    ();
    var trieParser = function() {
        var wordReduce = function(parent, l) {
            return (parent[l] = (parent[l] || ({})));
        }
        ;
        var wordsReduce = function(trie, word) {
            var node = reduce.call(word, wordReduce, trie);
            (node[""] = null);
            return trie;
        }
        ;
        var makeTrie = function(words) {
            return words.reduce(wordsReduce, ({}));
        }
        ;
        var _trie = function(trie, prefix) {
            var choices = [];
            Object.keys(trie).forEach(function(n) {
                if ((n.length === 1)){
                    choices.push(parse.next(charParser(n), _trie(trie[n], (prefix + n))));
                }
                
            }
            );
            if (trie.hasOwnProperty("")){
                choices.push(parse.always(prefix));
            }
            
            return parse.choice.apply(undefined, choices);
        }
        ;
        return function(nodes) {
            return _trie(makeTrie(nodes), "");
        }
        ;
    }
    ();
    var anyCharParser = parse.token(regExpTest.bind(/^.$/), expectError("any character"));
    var letterParser = parse.token(regExpTest.bind(/^[a-z]$/i), expectError("any letter character"));
    var spaceParser = parse.token(regExpTest.bind(/^\s$/i), expectError("any space character"));
    var digitParser = parse.token(regExpTest.bind(/^[0-9]$/i), expectError("any digit character"));
    return ({
        "character": charParser,
        "string": stringParser,
        "trie": trieParser,
        "anyChar": anyCharParser,
        "letter": letterParser,
        "space": spaceParser,
        "digit": digitParser
    });
}
);
