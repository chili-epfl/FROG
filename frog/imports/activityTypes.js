// @flow

import acVideo from 'ac-video';
import acIframe from 'ac-iframe';
import acText from 'ac-text';
import acForm from 'ac-form';
import acCollabForm from 'ac-collab-form';
import acQuiz from 'ac-quiz';
import acCKBoard from 'ac-ck-board';

import type { ActivityPackageT } from 'frog-utils';

import { keyBy } from 'lodash';

export const activityTypes: Array<ActivityPackageT> = [
  acVideo,
  acIframe,
  acText,
  acForm,
  acCollabForm,
  acCKBoard,
  acQuiz
];

export const activityTypesObj = keyBy(activityTypes, 'id');
