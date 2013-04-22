define(['parse/parse'], function(parse){
    return {
        'module': "Then Tests",
        'tests': [
            ["Simple Then",
            function(){
                var a = parse.then(parse.character('a'), parse.character('b'));
                
                assert.deepEqual(parse.run(a, "ab"), 'a');
                
                assert.deepEqual(
                    parse.run(parse.next(a, parse.character('c')), "abc"),
                    'c');
            }],
            ["P fail Then",
            function(){
                var a = parse.either(
                    parse.then(
                        parse.never(),
                        parse.character('b')),
                    parse.character('a'));
                
                assert.deepEqual(parse.run(a, "ab"), 'a');
            }],
            ["Q fail Then",
            function(){
                var a = parse.either(
                    parse.attempt(parse.then(
                        parse.character('a'),
                        parse.never('b'))),
                    parse.character('a'));
                
                assert.deepEqual(parse.run(a, "ab"), 'a');
            }],
        ],
    };
});
