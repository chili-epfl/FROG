// @flow

import acAutocode from 'ac-autocode';
import acDisplaySocial from 'ac-display-social';
import acUploader from 'ac-uploader';
import acProx from 'ac-prox';
import acImgClass from 'ac-imgClass';
import acImgView from 'ac-imgView';
import acInduction from 'ac-induction';
import acBrainstorm from 'ac-brainstorm';
import acChat from 'ac-chat';
import acVideo from 'ac-video';
import acIframe from 'ac-iframe';
import acText from 'ac-text';
import acForm from 'ac-form';
import acQuiz from 'ac-quiz';
import acCKBoard from 'ac-ck-board';

import { type ActivityPackageT, flattenOne } from 'frog-utils';

import { keyBy } from 'lodash';

export const activityTypes: ActivityPackageT[] = flattenOne([
  acAutocode,
  acDisplaySocial,
  acUploader,
  acImgView,
  acProx,
  acImgClass,
  acInduction,
  acBrainstorm,
  acChat,
  acVideo,
  acIframe,
  acText,
  acForm,
  acCKBoard,
  acQuiz
]).map(x => Object.freeze(x));

// see explanation of `any` in operatorTypes.js
export const activityTypesObj: { [actId: string]: ActivityPackageT } = (keyBy(
  activityTypes,
  'id'
): any);
