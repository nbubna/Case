### Case: An extensible string case convert, identify, and flip tool.

Download: [Case.min.js][prod]  or  [Case.js][dev]  
[NPM][npm]: `npm install Case`  
Bower: `bower install Case`  

[prod]: https://raw.github.com/nbubna/Case/master/dist/Case.min.js
[dev]: https://raw.github.com/nbubna/Case/master/dist/Case.js
[npm]: https://npmjs.org/package/Case

## Documentation
Each of the following functions will first "undo" previous case manipulations
before applying the desired case to the given string.

```javascript
Case.upper(str)                 // 'foo_bar'    -> 'FOO BAR'
Case.lower(str)                 // 'fooBar'     -> 'foo bar'
Case.snake(str)                 // 'Foo bar!'   -> 'foo_bar'
Case.squish(str)                // 'foo.bar'    -> 'FooBar'
Case.camel(str)                 // 'foo, bar'   -> 'fooBar'
Case.constant(str)              // 'Foo-Bar'    -> 'FOO_BAR'
Case.title(str)                 // 'foo v. bar' -> 'Foo v. Bar'
Case.capital(str)               // 'foo_v_bar'  -> 'Foo V Bar'
Case.sentence(str, properNames) // 'i said, "foo!"' -> 'I said, "Foo!"'
```

The sentence function accepts an array of proper names that should be capitalized,
regardless of location in the sentence.  This function is specialized, but useful
when dealing with input generated with capslock on (i.e. everything my grandma types).

There are three additional functions:
* `of(str)`: identifies the case of a string, returns undefined if it doesn't match a known type
* `flip(str)`: reverses the case of letters, no other changes
* `type(name, fn)`: extends Case with a new case type

```javascript
Case.of('foo') -> 'lower'
Case.of('foo_bar') -> 'snake'
Case.of('Foo v Bar') -> 'title'
Case.of('foo_ Bar') -> undefined

Case.flip('FlipMe') -> 'fLIPmE'
Case.flip('TEST THIS!') -> 'test this!'

Case.type('bang', function(s) {
    return Case.upper(s, '!')+'!';
});
Case.bang('bang') -> 'BANG!'
Case.of('TEST!THIS!') -> 'bang'
```

Registering functions via `type()` means `Case.of` supports them automatically.

Oh, did you notice that little `Case.upper(s, '!')`?
Yeah, `upper()` and `lower()` accept a second "fill" argument
that will replace any characters which are not letters or numbers.
It's handy, sometimes. :)


## Release History
* 2013-06-10 v1.0.0 (public, initial)

[v1.0.0]: https://github.com/nbubna/store/tree/1.0.0
