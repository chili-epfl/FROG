// @flow
import fileLI from '../../internalLearningItems/li-file';
import ideaLI from '../../internalLearningItems/li-idea';
import imageLI from '../../internalLearningItems/li-image';
import ideaCompoundLI from '../../internalLearningItems/li-ideaCompound';
import morseLI from '../../internalLearningItems/li-morse';

export type learningItemTypeT = {
  name: string,
  id: string,
  dataStructure?: any,
  viewer?: React.ComponentType<any>,
  create?: React.ComponentType<any>,
  editor?: React.ComponentType<any>,
  editable: boolean,
  viewThumb: React.ComponentType<any>,
  zoomable: boolean,
  editor?: React.ComponentType<any>,
  editable: boolean
};

export const learningItemTypesObj: {
  [name: string]: learningItemTypeT
} = {
  'li-idea': ideaLI,
  'li-file': fileLI,
  'li-image': imageLI,
  'li-ideaCompound': ideaCompoundLI,
  'li-morse': morseLI
};
