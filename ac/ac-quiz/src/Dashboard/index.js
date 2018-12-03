// @flow

import {
  ProgressDashboard,
  LeaderBoard,
  CoordinatesDashboard
} from 'frog-utils';

import ReactiveCountDashboard from './ReactiveCountDashboard';
import JustificationDashboard from './JustificationDashboard';

export default {
  counts: ReactiveCountDashboard,
  progress: ProgressDashboard,
  leaderboard: LeaderBoard,
  coordinates: { ...CoordinatesDashboard, displayCondition: 'argueWeighting' },
  justification: JustificationDashboard
};
