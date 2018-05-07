// @flow

import {
  ProgressDashboard,
  LeaderBoard,
  CoordinatesDashboard
} from 'frog-utils';

import ReactiveCountDashboard from './ReactiveCountDashboard';
import JustificationDashboard from './JustificationDashboard';

export default {
  reactive: ReactiveCountDashboard,
  progress: ProgressDashboard,
  leaderboard: LeaderBoard,
  coordinates: CoordinatesDashboard,
  justification: JustificationDashboard
};
