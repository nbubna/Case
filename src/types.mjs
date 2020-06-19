import * as _ from './utils.mjs';
import { re } from './utils.mjs';

export function lower(s, fill, deapostrophe) {
    return _.fill(_.low.call(_.prep(s, fill)), fill, deapostrophe);
}
export function snake(s) {
    return lower(s, '_', true);
}
export function constant(s) {
    return upper(s, '_', true);
}
export function camel(s) {
    return _.decap(pascal(s));
}
export function kebab(s) {
    return lower(s, '-', true);
}
export function upper(s, fill, deapostrophe) {
    return _.fill(_.up.call(_.prep(s, fill, false, true)), fill, deapostrophe);
}
export function capital(s, fill, deapostrophe) {
    return _.fill(
        _.prep(s).replace(re.capitalize, function (m, border, letter) {
            return border + _.up.call(letter);
        }),
        fill,
        deapostrophe,
    );
}
export function header(s) {
    return capital(s, '-', true);
}
export function pascal(s) {
    return _.fill(
        _.prep(s, false, true).replace(re.pascal, function (m, border, letter) {
            return _.up.call(letter);
        }),
        '',
        true,
    );
}
export function title(s) {
    return capital(s).replace(re.improper, function (small, p, i, s) {
        return i > 0 && i < s.lastIndexOf(' ') ? _.low.call(small) : small;
    });
}
export function sentence(s, names, abbreviations) {
    s = lower(s).replace(re.sentence, function (m, prelude, letter) {
        return prelude + _.up.call(letter);
    });
    if (names) {
        names.forEach(function (name) {
            s = s.replace(new RegExp('\\b' + lower(name) + '\\b', 'g'), _.cap);
        });
    }
    if (abbreviations) {
        abbreviations.forEach(function (abbr) {
            s = s.replace(
                new RegExp('(\\b' + lower(abbr) + '\\. +)(\\w)'),
                function (m, abbrAndSpace, letter) {
                    return abbrAndSpace + _.low.call(letter);
                },
            );
        });
    }
    return s;
}
