// @flow
import * as React from 'react';
import { type ActivityPackageT, type ActivityDbT } from 'frog-utils';

export type StateT = {
  stage: number,
  activityType?: ActivityPackageT,
  activity?: ActivityDbT,
  config?: Object,
  slug?: string
};

export type ShowModalFunctionT = (View: React.Node) => void;

export type HideModalFunctionT = () => void;

export type PropsT = {
  classes: Object,
  showModal: ShowModalFunctionT,
  hideModal: HideModalFunctionT
};
