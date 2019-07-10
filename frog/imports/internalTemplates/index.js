// @flow

import { values } from 'frog-utils';
import peerReview from './te-peerReview';

export const templatesObj = { 'te-peerReview': peerReview };
export const templates = values(templatesObj);
