(function() {

  var types = this.types = {
    camel: 'thisIsNiceAndTidyNathan',
    snake: 'this_is_nice_and_tidy_nathan',
    kebab: 'this-is-nice-and-tidy-nathan',
    upper: 'THIS IS NICE AND TIDY, NATHAN.',
    lower: 'this is nice and tidy, nathan.',
    header: 'This-Is-Nice-And-Tidy-Nathan',
    sentence: 'This is nice and tidy, Nathan.',
    capital: 'This Is Nice And Tidy, Nathan.',
    title: 'This Is Nice and Tidy, Nathan.',
    constant: 'THIS_IS_NICE_AND_TIDY_NATHAN'
  },
  properNames = ['Nathan'],
  _ = Case._;

  function convert(a, b) {
    test(a+' to '+b, function() {
      expect(2);
      var arg = b === "sentence" ? properNames : undefined,
          direct = Case[b](types[a], arg),
          viaTo = types[a]['to'+_.cap(b)+'Case'](arg),
          lossy = direct.length < types[b].length,
          expected = lossy ? types[b].replace(/[^\w ]/g,'') : types[b];
      strictEqual(direct, expected);
      strictEqual(viaTo, expected);
    });
  }

  function identify(a) {
    test('identify '+a, function() {
      expect(1);
      var actual = Case.of(types[a], a === "sentence" ? properNames : undefined);
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

  test('whitelisted period words', function() {
    var output = Case.sentence('the 12 oz. drink was cold', null, ["oz"]);
    strictEqual(output, 'The 12 oz. drink was cold');
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

  test('#16 - no holes in lone words', function() {
    // keep prefix and/or suffix symbols for single words
    equal(Case.title("-30"), "-30");
    equal(Case.capital("STOP!"), "Stop!");
    equal(Case.upper("'quote'"), "'QUOTE'");
    equal(Case.lower('"Quotes"'), '"quotes"');

    // except when it's a banned symbol
    equal(Case.constant("-30"), "_30");
    equal(Case.snake('STOP!'), "stop");
  });

  test('upper, lower, capital extra arguments', function() {
    equal(Case.lower('FOO-BAR', '.'), 'foo.bar');
    equal(Case.upper('Foo? Bar.', '-'), 'FOO-BAR');
    equal(Case.capital("don'tSpeak", '-'), "Don't-Speak");

    equal(Case.capital("don't speak", '-', true), 'Dont-Speak');
    equal(Case.lower("DON'T KEEP 'EM", '__', true), "dont__keep__em");
    equal(Case.upper("i'm not sure", "/", true), "IM/NOT/SURE");

    equal(Case.upper("I, Barnabas, ain't happy!", null, true), "I, BARNABAS, AINT HAPPY!");
    equal(Case.lower("I, Barnabas, ain't happy!", null, false), "i, barnabas, ain't happy!");
    equal(Case.capital("I, Barnabas, ain't happy!", ' + ', true), "I + Barnabas + Aint + Happy");
  });


  test('#20 - empty string to sentence function causes error', function() {
    equal(Case.lower(''), '');
    equal(Case.upper(''), '');
    equal(Case.capital(''), '');
    equal(Case.pascal(''), '');
    equal(Case.sentence(''), '');
  });

  test('#22 - extra args to Case.of and to[Type]Case', function() {
    // make sure Case.of can handle names in sentence case
    equal(Case.of("Hello, Sue, how is Bob?", ['Sue', 'Bob']), "sentence");
    // a fill argument
    equal("best_case_ever".toCapitalCase(". "), "Best. Case. Ever");
    // fill and noApostrophes both
    equal("i'm not sure".toUpperCase("/", true), "IM/NOT/SURE");
  });

  test('outliers', function() {
    equal(Case.lower(undefined), '', "empty should be empty string");
    equal(Case.sentence(null), '', "empty should be empty string");
    equal(Case.capital(false), 'False');
    equal(Case.upper(true), 'TRUE');
    equal(Case.pascal({}), 'ObjectObject', "should strip brackets and space from ugly default toString");
    equal(Case.snake([]), '', "javascript is weird, but []+''=''");
    equal(Case.constant(0), '0');
    var date = Date.now().toString();
    equal(Case.title({toString:function(){ return date;}}), date, "should not use Object.prototype.toString");
  });

  test('Case.of priorities', function() {
    equal(Case.of('Bread'), 'capital');
    equal(Case.of('Content-Type'), 'header');
  });

  test('#26 - constant issue', function() {
    var re = Case._.re;
    equal(Case.of('hardOne'), 'camel', 'should identify as camel');
    equal('hardOne'.replace(re.relax, Case._.relax), 'hard One', 'should put space before One');
    equal('thisIsHard'.replace(re.relax, Case._.relax), 'this Is Hard', 'should put space before words');
    equal(Case._.prep('hardOne', '_', false, true), 'hard One', 'should get a space before P');
    equal(Case.constant('hardOne'), 'HARD_ONE', 'constant!');
    //TODO: get this working
    //equal(Case.constant('useHTTP2'), 'USE_HTTP2');
    equal('thisIsAPunk'.replace(re.relax, Case._.relax), 'this Is A Punk', 'should put space before words');
  });

}());
