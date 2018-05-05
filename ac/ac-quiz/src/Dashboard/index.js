// @flow

import {
  ProgressDashboard,
  LeaderBoard,
  CoordinatesDashboard
} from 'frog-utils';

import CountDashboard from './CountDashboard';
import ReactiveCountDashboard from './ReactiveCountDashboard';
import JustificationDashboard from './JustificationDashboard';

export default {
  count: CountDashboard,
  progress: ProgressDashboard,
  leaderboard: LeaderBoard,
  coordinates: CoordinatesDashboard,
  justification: JustificationDashboard,
  reactive: ReactiveCountDashboard
};
