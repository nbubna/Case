import * as _ from './utils.mjs';
import * as types from './types.mjs';

const typesArray = Object.keys(types);

function of(s) {
    for (var i = 0, m = typesArray.length; i < m; i++) {
        if (Case[typesArray[i]].apply(Case, arguments) === s) {
            return typesArray[i];
        }
    }
}

function flip(s) {
    return s.replace(/\w/g, function (l) {
        return (l == _.up.call(l) ? _.low : _.up).call(l);
    });
}

function random(s) {
    return s.replace(/\w/g, function (l) {
        return (Math.round(Math.random()) ? _.up : _.low).call(l);
    });
}

function type(type, fn) {
    Case[type] = fn;
    typesArray.push(type);
}

const utils = {
    ..._,
    types: typesArray,
};

const Case = {
    _:utils,
    of,
    flip,
    random,
    type,
    ...types,
};

// TODO: can't export these
// export {of,flip,random,type,utils as _ };
// export * from './types.mjs';

export default Case;
