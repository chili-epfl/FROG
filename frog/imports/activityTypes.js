// @flow

import { keyBy } from 'lodash';
import {
  type ActivityPackageT,
  flattenOne,
  type LearningItemT
} from 'frog-utils';

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

import fileLI from './internalLearningItems/li-file';
import ideaLI from './internalLearningItems/li-idea';
import imageLI from './internalLearningItems/li-image';
import ideaCompoundLI from './internalLearningItems/li-ideaCompound';
import cs211LI from './internalLearningItems/li-cs211';
import spreadsheetLI from './internalLearningItems/li-spreadsheet';
import { operatorTypes } from './operatorTypes';

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
const packageLIs = [...activityTypes, ...operatorTypes].reduce(
  (acc, x) => acc.concat(x.LearningItems || []),
  []
);

const packageMerge = keyBy(packageLIs, 'id');

export const learningItemTypesObj: {
  [name: string]: LearningItemT<any>
} = {
  ...packageMerge,
  'li-idea': ideaLI,
  'li-file': fileLI,
  'li-image': imageLI,
  'li-ideaCompound': ideaCompoundLI,
  'li-cs211': cs211LI,
  'li-spreadsheet': spreadsheetLI
};
