define(['parse/parse', 'parse/string'],
function(parse, parse_string){
    return {
        'module': "parse.choice",
        'tests': [
            ["Succeed",
            function(){
                var a = parse.choice(
                    parse_string.character('a'),
                    parse_string.character('b'),
                    parse_string.character('c'));
                
                assert.deepEqual(parse.run(a, "abc"), 'a');
                
                assert.deepEqual(parse.run(a, "bac"), 'b');
                
                assert.deepEqual(parse.run(a, "cab"), 'c');
            }],
            ["Zero choices construct error",
             function(){
                assert.throws(function(){ parse.run(parse.choice(), "aa"); }, parse.ParserError);
            }],
            ["Failed Choices",
            function(){
                var a = parse.choice(
                    parse_string.character('a'),
                    parse_string.character('b'),
                    parse_string.character('c'));
                
                assert.throws(parse.run.bind(undefined, a, "z"));
                
                assert.throws(parse.run.bind(undefined, a, ""));
             }],
             ["Choice Order",
             function(){
                var a = parse.choice(
                    parse_string.string('a'),
                    parse_string.string('aa'),
                    parse_string.string('aaa'));
                assert.deepEqual(parse.run(a, "aaaa"), 'a');
                
                assert.deepEqual(parse.run(parse.choice(
                    parse_string.string('aaa'),
                    parse_string.string('aa'),
                    parse_string.string('a')), 'aaaa'), 'aaa');
            }]
        ],
    };
});
