// @flow

import {
  ProgressDashboard,
  LeaderBoard,
  CoordinatesDashboard
} from 'frog-utils';

import ReactiveCountDashboard from './ReactiveCountDashboard';

export default {
  answers: ReactiveCountDashboard,
  progress: ProgressDashboard,
  leaderboard: LeaderBoard,
  coordinates: { ...CoordinatesDashboard, displayCondition: 'argueWeighting' }
};
