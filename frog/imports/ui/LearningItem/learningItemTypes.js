// @flow
import { learningItemTypeT } from 'frog-utils';

import fileLI from '../../internalLearningItems/li-file';
import ideaLI from '../../internalLearningItems/li-idea';
import imageLI from '../../internalLearningItems/li-image';
import ideaCompoundLI from '../../internalLearningItems/li-ideaCompound';
import morseLI from '../../internalLearningItems/li-morse';
import tableLI from '../../internalLearningItems/li-table';

export const learningItemTypesObj: {
  [name: string]: learningItemTypeT
} = {
  'li-idea': ideaLI,
  'li-file': fileLI,
  'li-image': imageLI,
  'li-ideaCompound': ideaCompoundLI,
  'li-morse': morseLI,
  'li-table': tableLI
};
