export const names = [
  'Peter',
  'Anna',
  'John',
  'Ole',
  'Niels',
  'Gregor',
  'ChenLi',
  'Ananda',
  'Rupert',
  'Ben'
];

// Helper functions for nicely displaying uid
export const uidColor = uid => {
  var colors = [
    'red',
    'blue',
    'green',
    'purple',
    'orange',
    'olive',
    'maroon',
    'yellow',
    'lime',
    'teal'
  ];
  return colors[names.findIndex(x => x === uid)];
};

export const generateUID = () => names[Math.floor(Math.random() * 10)];
