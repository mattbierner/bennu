define(['parse/parse',
        'parse/text'],
function(parse,
        parse_text){
    
    return {
        'module': "Trie",
        'tests': [
            ["Unique Tries",
            function(){
                var p = parse_text.trie(['abc', 'xyz', 'def']);
                
                assert.deepEqual(parse.run(p, "abc"), 'abc');
                assert.deepEqual(parse.run(p, "abcd"), 'abc');
                assert.throws(parse.run.bind(undefined, p, "ab"));
                
                assert.deepEqual(parse.run(p, "def"), 'def');
            }],
            ["Longest",
            function(){
                var p = parse_text.trie(['a', 'ab', 'abc']);
                
                assert.deepEqual(parse.run(p, "a"), 'a');
                assert.deepEqual(parse.run(p, "abc"), 'abc');
                assert.deepEqual(parse.run(p, "abz"), 'ab');
                assert.throws(parse.run.bind(undefined, p, "f"));
            }],
             ["Longest backtracking",
            function(){
                var p = parse_text.trie(['a', 'abcd', 'abcz']);
                
                assert.deepEqual(parse.run(p, "a"), 'a');
                assert.deepEqual(parse.run(p, "abc"), 'a');
                assert.deepEqual(parse.run(p, "abcy"), 'a');
            }],
            ["No match does not consume",
            function(){
                var p = parse_text.trie(['abcd', 'abcz']);
                
                assert.deepEqual(parse.run(p, "abcd"), 'abcd');
                assert.deepEqual(parse.run(p, "abcz"), 'abcz');
                assert.deepEqual(parse.run(parse.either(p, parse.always('none')), "a"), 'none');
                assert.deepEqual(parse.run(parse.next(
                    parse.optional(null, p),
                    parse_text.string('xyz')), "xyz"), 'xyz');
            }]
           
        ],
    };
});
