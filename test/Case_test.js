(function() {

  var types = this.types = {
    camel: 'thisIsNiceAndTidyNathan',
    snake: 'this_is_nice_and_tidy_nathan',
    upper: 'THIS IS NICE AND TIDY, NATHAN.',
    lower: 'this is nice and tidy, nathan.',
    sentence: 'This is nice and tidy, nathan.',
    capital: 'This Is Nice And Tidy, Nathan.',
    title: 'This Is Nice and Tidy, Nathan.'
  };

  function convert(a, b) {
    test(a+' to '+b, function() {
      expect(2);
      var direct = Case[b](types[a]),
          viaTo = types[a]['to'+Case.capital(b)+'Case'](),
          lossy = (a === 'camel' || a === 'snake') && (b !== 'camel' && b !== 'snake'),
          expected = lossy ? Case._.clean(types[b]) : types[b];
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

  //module('Sentence with names');
  //TODO

}());
