export const isBrowser = (() => {
  try {
    return !!window;
  } catch (e) {
    return false;
  }
})();

export const hark = isBrowser ? require('../lib/hark.bundle.js') : () => null;

export const onStreamAdded = (stream, options) => {
  if (options && options.local) {
    console.log('Received local stream');
  }
  if (options && options.remote) {
    console.log('Received remote stream');
  }

  var speechEvents = hark(stream);

  speechEvents.on('speaking', function() {
    console.log('speaking');
    if (options && options.logger) {
      options.logger({
        type: 'videochat',
        payload: {
          name: options.name,
          id: options.id,
          speaking: true
        }
      });
    }
  });

  speechEvents.on('stopped_speaking', function() {
    console.log('stopped speaking');
    if (options && options.logger) {
      options.logger({
        type: 'videochat',
        payload: {
          name: options.name,
          id: options.id,
          speaking: false
        }
      });
    }
  });
};
