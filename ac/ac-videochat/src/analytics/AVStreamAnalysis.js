// @flow

export const isBrowser = (() => {
  try {
    return !!window;
  } catch (e) {
    return false;
  }
})();

export const hark = isBrowser
  ? require('../lib/hark.bundle.js')
  : (_: any) => {};

type OptionsT = {
  name: string,
  id: string,
  logger: Function
};

export const onStreamAdded = (stream: MediaStream, options: OptionsT) => {
  if (hark && stream.getAudioTracks().length !== 0) {
    const speechEvents: any = hark(stream);

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
  }
};

export const onVAD = (stream: MediaStream, callback: Function) => {
  if (hark && stream.getAudioTracks().length !== 0) {
    const speechEvents: any = hark(stream);

    speechEvents.on('speaking', () => {
      callback(true);
    });

    speechEvents.on('stopped_speaking', () => {
      callback(false);
    });
  }
};
