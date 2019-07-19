// @flow

import {
  type ActivityPackageT,
  type ActivityDbT } from '/imports/frog-utils'; 
  import {
  type ShowModalFunctionT,
  type HideModalFunctionT
} from '/imports/ui/Modal/types';

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
