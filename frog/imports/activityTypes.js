// @flow

import { keyBy } from 'lodash';
import { type ActivityPackageT, flattenOne } from 'frog-utils';

import acSingleLi from 'ac-single-li';
import acTrain from 'ac-train';
import acRanking from 'ac-ranking';
import acDual from 'ac-dual';
import acTimedQuiz from 'ac-timedQuiz';
import acStroop from 'ac-stroop';
import acTextarea from 'ac-textarea';
import acAutocode from 'ac-autocode';
import acDisplaySocial from 'ac-display-social';
import acUploader from 'ac-uploader';
import acProx from 'ac-prox';
import acClassifier from 'ac-classifier';
import acGallery from 'ac-gallery';
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
import acPrez from 'ac-prez';
import acVideoChat from 'ac-videochat';

import acH5P from './internalActivities/ac-h5p';
import acDash from './internalActivities/ac-dash';

export const activityTypes: ActivityPackageT[] = flattenOne([
  acSingleLi,
  acTrain,
  acRanking,
  acDual,
  acTimedQuiz,
  acStroop,
  acTextarea,
  acAutocode,
  acDisplaySocial,
  acUploader,
  acGallery,
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
  acDash,
  acVideoChat,
  acPrez
]).map(x => Object.freeze(x));

// see explanation of `any` in operatorTypes.js
export const activityTypesObj: { [actId: string]: ActivityPackageT } = (keyBy(
  activityTypes,
  'id'
): any);
