// @flow

import acBrainstorm from 'ac-brainstorm';
import acChat from 'ac-chat';
import acVideo from 'ac-video';
import acIframe from 'ac-iframe';
import acText from 'ac-text';
import acForm from 'ac-form';
import acQuiz from 'ac-quiz';
import acCKBoard from 'ac-ck-board';

import type { ActivityPackageT } from 'frog-utils';

import { keyBy } from 'lodash';

export const activityTypes: Array<ActivityPackageT> = [
  acBrainstorm,
  acChat,
  acVideo,
  acIframe,
  acText,
  acForm,
  acCKBoard,
  acQuiz
];

export const activityTypesObj = keyBy(activityTypes, 'id');
