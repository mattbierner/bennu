define(['parse/parse', 'parse/text'],
function(parse, parse_text){
    return {
        'module': "parse.choice",
        'tests': [
            ["Succeed",
            function(){
                var a = parse.choice(
                    parse_text.character('a'),
                    parse_text.character('b'),
                    parse_text.character('c'));
                
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
                    parse_text.character('a'),
                    parse_text.character('b'),
                    parse_text.character('c'));
                
                assert.throws(parse.run.bind(undefined, a, "z"));
                
                assert.throws(parse.run.bind(undefined, a, ""));
             }],
             ["Choice Order",
             function(){
                var a = parse.choice(
                    parse_text.string('a'),
                    parse_text.string('aa'),
                    parse_text.string('aaa'));
                assert.deepEqual(parse.run(a, "aaaa"), 'a');
                
                assert.deepEqual(parse.run(parse.choice(
                    parse_text.string('aaa'),
                    parse_text.string('aa'),
                    parse_text.string('a')), 'aaaa'), 'aaa');
            }]
        ],
    };
});
