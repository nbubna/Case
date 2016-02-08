(function() {

  var types = this.types = {
    camel: 'thisIsNiceAndTidyNathan',
    snake: 'this_is_nice_and_tidy_nathan',
    kebab: 'this-is-nice-and-tidy-nathan',
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

  module('random');
  test('has random', function() {
    equal(typeof Case.random, 'function', 'has random util function');
    var string = 'The quick brown fox jumps over the lazy dog.',
      r1 = Case.random(string),
      r2 = Case.random(string);
    notEqual(r1, r2, 'odds are very low that these will turn out equal');
    equal(string.length, r1.length, 'should not change length');
    equal(r1.charAt(r1.length - 1), '.', 'should still end in period');
    equal(r2.charAt(r2.length - 1), '.', 'should still end in period');
  });

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

  test('#7 - diacritics', function() {
    equal(Case.upper('résumé'), 'RÉSUMÉ');
    equal(Case.lower('RÉSUMÉ'), 'résumé');
    equal(Case.snake('SíDéRá'), 'sí_dé_rá');
  });

  test('#13 - cap small words at start and/or end of title', function() {
    equal(Case.title('and i love you!'), "And I Love You!");
    equal(Case.title('the challenge of'), "The Challenge Of");
    equal(Case.title('FARTHER IN'), "Farther In");
    equal(Case.title('and...'), "And...");
  });

  test('#14 - Case.of("foo") -> "snake"', function() {
    equal(Case.of('foo'), 'lower');
    equal(Case.of('foo_bar'), 'snake');
  });

  test('#15 - the apostrophe catastrophe"', function() {
    var apostro = "we can't stop";
    // keep it
    equal(Case.capital("i'm"), "I'm");
    equal(Case.capital(apostro), "We Can't Stop");
    equal(Case.title(apostro), "We Can't Stop");
    equal(Case.sentence(apostro), "We can't stop");
    equal(Case.upper(apostro), "WE CAN'T STOP");
    equal(Case.lower(apostro), apostro);

    // ditch it
    equal(Case.constant(apostro), "WE_CANT_STOP");
    equal(Case.kebab(apostro), "we-cant-stop");
    equal(Case.snake(apostro), "we_cant_stop");
    equal(Case.camel(apostro), "weCantStop");
    equal(Case.pascal(apostro), "WeCantStop");

    // fill it? methinks, no...
  });

}());
