var parse = require('../index').parse;
var parse_text = require('../index').text;


exports.stringObject = function(test) {
    test.deepEqual(parse.run(parse_text.character('a'), new String('a')), 'a');
    test.deepEqual(parse.run(parse_text.character(new String('a')), 'a'), 'a');
    test.deepEqual(parse.run(parse_text.character(new String('a')), new String('a')), 'a');
    test.done();
};