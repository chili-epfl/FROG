const splitAt = function(i, xs) {
  var a = xs.slice(0, i);
  var b = xs.slice(i, xs.length);
  return [a, b];
};

const shuffle = function(xs) {
  return xs.slice(0).sort(function() {
    return .5 - Math.random();
  });
};

const zip = function(xs) {
  return xs[0].map(function(_,i) {
    return xs.map(function(x) {
      return x[i];
    });
  });
}

export const config = {
  title: 'Configuration for Random Group Formation',
  type: 'object',
  properties: {
    'groupSize': {
      type: 'number',
      title: 'Group size'
    },
  }
}

// Obviously assumes even array
export const operator = (names) => zip(splitAt(names.length/2, shuffle(names)))

export default { id: 'op-random', operator: operator, config: config }
