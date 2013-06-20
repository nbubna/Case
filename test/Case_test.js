(function() {

  var types = this.types = {
    camel: 'thisIsNiceAndTidyNathan',
    snake: 'this_is_nice_and_tidy_nathan',
    upper: 'THIS IS NICE AND TIDY, NATHAN.',
    lower: 'this is nice and tidy, nathan.',
    sentence: 'This is nice and tidy, nathan.',
    capital: 'This Is Nice And Tidy, Nathan.',
    title: 'This Is Nice and Tidy, Nathan.',
    constant: 'THIS_IS_NICE_AND_TIDY_NATHAN'
  },
  _ = Case._;

  function convert(a, b) {
    test(a+' to '+b, function() {
      expect(2);
      var direct = Case[b](types[a]),
          viaTo = types[a]['to'+_.cap(b)+'Case'](),
          lossy = direct.length < types[b].length,
          expected = lossy ? types[b].replace(/[^\w ]/g,'') : types[b];
      strictEqual(direct, expected);
      strictEqual(viaTo, expected);
    });
  }

  function identify(a) {
    test('identify '+a, function() {
      expect(1);
      var actual = Case.of(types[a]);
      strictEqual(actual, a);
    });
  }

  function flip(name, input, output) {
    test(name, function() {
      expect(2);
      strictEqual(Case.flip(input), output);
      strictEqual(Case.flip(output), input);
    });
  }

  module('Case conversion');
  for (var a in types) {
    for (var b in types) {
      convert(a, b);
    }
  }

  module('Case identification');
  for (var c in types) {
    identify(c);
  }

  module('Sentences');
  test('with names', function() {
    strictEqual(Case.sentence('IT\'S FRIDAY, JOE!', ['Friday','Joe']), 'It\'s Friday, Joe!');
  });
  test('quotes', function() {
    var output = Case.sentence('he walked in. "hi," he said! she replied, "yes?" "oh, nevermind."');
    strictEqual(output, 'He walked in. "Hi," he said! She replied, "Yes?" "Oh, nevermind."');
  });

  module('flip');
  flip('low/high', 'TEST THIS', 'test this');
  flip('mixed', "Test This", "tEST tHIS");
  flip('junk', ".,?!_ ", ".,?!_ ");

  module('add type');
  test('add bang', function() {
    ok(!Case.bang, 'should not be Case.bang');
    Case.type('bang', function(s) {
      return Case.upper(s, '!')+'!';
    });
    ok(Case.bang, 'should be a bang');
  });
  test('use bang', function() {
    strictEqual(Case.bang('hi there'), 'HI!THERE!');
    strictEqual('bang'.toBangCase(), 'BANG!');
  });

  module('issues');
  test('#1 - single letter word decamel-izing', function() {
    strictEqual(Case.snake('thisIsATest'), 'this_is_a_test');
    strictEqual(Case.capital('thisIsATestByESHAResearch'), 'This Is A Test By ESHA Research');
  });

}());
