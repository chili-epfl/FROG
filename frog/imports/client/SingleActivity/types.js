// @flow

import {
  type ActivityPackageT,
  type ActivityDbT,
  type ShowModalFunctionT,
  type HideModalFunctionT
} from '/imports/frog-utils';

export type StateT = {
  stage: number,
  activityType?: ActivityPackageT,
  activity?: ActivityDbT,
  config?: Object,
  slug?: string
};

export type PropsT = {
  classes: Object,
  showModal: ShowModalFunctionT,
  hideModal: HideModalFunctionT
};