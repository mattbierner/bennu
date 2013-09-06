define(['parse/parse', 'parse/string'],
function(parse, parse_string){
    return {
        'module': "parse.attempt",
        'tests': [
            ["Success",
            function(){
                var result = parse.run(
                    parse.attempt(parse.always(3)),
                    "abc"
                );
                assert.deepEqual(result, 3);
            }],
            ["Fail is same as never",
            function(){
                 assert.throws(parse.run.bind(undefined,
                     parse.attempt(parse.fail()),
                     "abc"
                 ));
                 var result = parse.run(
                     parse.either(
                         parse.attempt(parse.next(parse_string.character('a'),
                             parse_string.character('b'))),
                         parse.next(parse_string.character('a'),
                             parse_string.character('c'))
                     ),
                     'ac'
                 );
                 assert.deepEqual(result, 'c');
             }],
           
        ],
    };
});
