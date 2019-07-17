// @flow

import { values } from '/imports/frog-utils';
import peerReview from './te-peerReview';

export const templatesObj = { 'te-peerReview': peerReview };
export const templates = values(templatesObj);
