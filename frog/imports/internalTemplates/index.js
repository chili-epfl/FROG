// @flow

import { values } from '/imports/frog-utils';
import peerReview from './te-peerReview';
import writing from './te-writing';

export const templatesObj = {
  'te-peerReview': peerReview,
  'te-writing': writing
};
export const templates = values(templatesObj);
