// @flow

import { type LearningItemT } from 'frog-utils';

import fileLI from '../../internalLearningItems/li-file';
import ideaLI from '../../internalLearningItems/li-idea';
import imageLI from '../../internalLearningItems/li-image';
import ideaCompoundLI from '../../internalLearningItems/li-ideaCompound';
import cs211LI from '../../internalLearningItems/li-cs211';

export const learningItemTypesObj: {
  [name: string]: LearningItemT<any>
} = {
  'li-idea': ideaLI,
  'li-file': fileLI,
  'li-image': imageLI,
  'li-ideaCompound': ideaCompoundLI,
  'li-cs211': cs211LI
};
