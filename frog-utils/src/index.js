export { default as color_range } from './color_range'
export { default as Chat } from './chat'

export const uuid = () =>
  ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,a=>(a^Math.random()*16>>a/4).toString(16))

export const currentDate = () => {
  let d = new Date()
  return d.toString()
}

export const booleanize = (bool) => (bool == 'true') ? true : false

export const shorten = (text, length) => {
  let t = text || ''
  if (t.length < length) {
    return t
  } else {
    return t.slice(0, length-3)+'...'
  }
}

export const compose = (...args) => initial => args.reduce(
    (result, fn) => fn(result),
    initial
)

export const composeReducers = (...args) => {
  const ret = (initState, action) => args.reduce(
    (state, fn) => fn(state, action),
      initState
  )
  return ret
}

// checks that some of the values in an object are not empty
export const notEmpty = (obj) => {
  if(!obj) { return false }
  return Object.keys(obj).reduce(
    (acc, val) => acc || Boolean(obj[val]), false)
}

export const identity = (e) => e

// for classState and studentState, we are getting an array from Horizon, but
// we will only have one element of each type with a given class/student ID
// this let's us easily pick that element out and switch on it
// for example getKey('tablet_locked', classState) will return the value if
// the element exists, and undefined if it does not
export const getKey = (key, array) => {
  return false
}

// list utils
const splitAt = function(i, xs) {
  var a = xs.slice(0, i);
  var b = xs.slice(i, xs.length);
  return [a, b];
};

const shuffleList = function(xs) {
  return xs.slice(0).sort(function() {
    return .5 - Math.random();
  });
};

const zipList = function(xs) {
  return xs[0].map(function(_,i) {
    return xs.map(function(x) {
      return x[i];
    });
  });
}
