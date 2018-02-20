// @flow

import acStroop from 'ac-stroop';
import { keyBy } from 'lodash';
import { type ActivityPackageT, flattenOne } from 'frog-utils';

import acWebrtc from 'ac-webrtc';
import acTextarea from 'ac-textarea';
import acAutocode from 'ac-autocode';
import acDisplaySocial from 'ac-display-social';
import acUploader from 'ac-uploader';
import acProx from 'ac-prox';
import acClassifier from 'ac-classifier';
import acImage from 'ac-image';
import acInduction from 'ac-induction';
import acBrainstorm from 'ac-brainstorm';
import acChat from 'ac-chat';
import acVideo from 'ac-video';
import acIframe from 'ac-iframe';
import acText from 'ac-text';
import acForm from 'ac-form';
import acQuiz from 'ac-quiz';
import acMonty from 'ac-monty';
import acCKBoard from 'ac-ck-board';

import acH5P from './internalActivities/ac-h5p';
import acDash from './internalActivities/ac-dash';

export const activityTypes: ActivityPackageT[] = flattenOne([
  acStroop,
  acWebrtc,
  acTextarea,
  acAutocode,
  acDisplaySocial,
  acUploader,
  acImage,
  acProx,
  acClassifier,
  acInduction,
  acBrainstorm,
  acChat,
  acVideo,
  acIframe,
  acText,
  acForm,
  acCKBoard,
  acQuiz,
  acMonty,
  acH5P,
  acDash
]).map(x => Object.freeze(x));

// see explanation of `any` in operatorTypes.js
export const activityTypesObj: { [actId: string]: ActivityPackageT } = (keyBy(
  activityTypes,
  'id'
): any);
