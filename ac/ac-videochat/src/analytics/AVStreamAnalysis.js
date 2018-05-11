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

  const speechEvents = hark(stream);

  speechEvents.on('speaking', () => {
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

  speechEvents.on('stopped_speaking', () => {
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
