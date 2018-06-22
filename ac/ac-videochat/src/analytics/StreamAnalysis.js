// @flow

import * as VAD from './components/VoiceActivityDetectionAnalysis';
import * as AudioProperties from './components/AudioPropertiesAnalysis';
import * as VideoEmotion from './components/VideoEmotionAnalysis';

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

export const anayzeStream = (stream: MediaStream, options: OptionsT) => {
  VAD.analyze(stream, options);
  AudioProperties.analyze(stream, options);
  //VideoEmotion.analyze(stream);
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
