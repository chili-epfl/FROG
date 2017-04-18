// @flow

import acBrainstorm from 'ac-brainstorm';
import acCKBoard from 'ac-ck-board';
import acForm from 'ac-form';
import acIframe from 'ac-iframe';
import acJigsaw from 'ac-jigsaw';
import acQuiz from 'ac-quiz';
import acText from 'ac-text';
import acVideo from 'ac-video';

import type { ActivityPackageT } from 'frog-utils';

import { keyBy } from 'lodash';

export const activityTypes: Array<ActivityPackageT> = [
  acBrainstorm,
  acCKBoard,
  acForm,
  acIframe,
  acJigsaw,
  acQuiz,
  acText,
  acVideo
];

export const activityTypesObj = keyBy(activityTypes, 'id');
