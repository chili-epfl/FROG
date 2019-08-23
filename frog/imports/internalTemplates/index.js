// @flow

import { values, type TemplatePackageT } from '/imports/frog-utils';
import peerReview from './te-peerReview';
import writing from './te-writing';

export const templatesObj: { [key: string]: TemplatePackageT } = {
  'te-peerReview': peerReview,
  'te-writing': writing
};

export const templateTypes: TemplatePackageT[] = values(templatesObj);
