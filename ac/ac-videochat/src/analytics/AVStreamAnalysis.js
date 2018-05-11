export const isBrowser = (() => {
  try {
    return !!window;
  } catch (e) {
    return false;
  }
})();

export const hark = isBrowser ? require('../lib/hark.bundle.js') : () => null;

type OptionsT = {
  name: string,
  id: string,
  logger: Function
};

export const onStreamAdded = (stream: MediaStream, options) => {
  const speechEvents = hark(stream);

  speechEvents.on('speaking', () => {
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
