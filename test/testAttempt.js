define(['parse'], function(parse){
    
    return {
        'module': "Attempt Tests",
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
                     parse.attempt(parse.never()),
                     "abc"
                 ));
                 var result = parse.run(
                     parse.either(
                         parse.attempt(
                             parse.next(parse.char('a'), parse.char('b'))),
                         parse.next(parse.char('a'), parse.char('c'))
                     ),
                     'ac'
                 );
                 assert.deepEqual(result, 'c');
             }],
           
        ],
    };
});
