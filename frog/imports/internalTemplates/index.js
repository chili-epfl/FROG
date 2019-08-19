// @flow

import { values, type TemplatePackageT } from '/imports/frog-utils';
import peerReview from './te-peerReview';

export const templatesObj: { [key: string]: TemplatePackageT } = {
  'te-peerReview': peerReview
};

export const templateTypes: TemplatePackageT[] = values(templatesObj);
