// @flow
/* eslint-disable react/no-array-index-key */

export { Loadable } from './Loadable';

export { isBrowser } from './isBrowser';

export {
  ReactJsonView,
  EnhancedForm,
  ReactiveRichText
} from './browserOnlyComponents';

export {
  hideConditional,
  calculateHides,
  calculateSchema,
  defaultConfig
} from './enhancedFormUtils';
export { MemDoc, pureObjectReactive } from './generateReactiveMem';
export { Highlight } from './highlightSubstring';
export { default as HTML } from './renderHTML';
export { unicodeLetter, notUnicodeLetter } from './unicodeRegexpEscapes';
export { ReactiveText } from './ReactiveText';
export { msToString } from './msToString';
export { default as uuid } from 'cuid';
export { default as SearchField } from './SearchField';
export { default as colorRange } from './colorRange';
export { default as unrollProducts } from './unrollProducts';
export { default as TimedComponent } from './TimedComponent';
export { TextInput, ChangeableText } from './TextInput';
export { default as ImageReload } from './ImageReload';
export { default as cleanEmptyCols } from './cleanEmptyCols';
export { default as strfTime } from './strfTime';
export { default as chainUpgrades } from './chainUpgrades';
export {
  mergeSocialStructures,
  focusStudent,
  focusRole,
  getAttributeKeys,
  getAttributeValues
} from './socstructTools';
export {
  wrapUnitAll,
  extractUnit,
  getMergedExtractedUnit
} from './dataStructureTools';
export type {
  ActivityDbT,
  DashboardDataDbT,
  MongoT,
  CursorT,
  OperatorDbT,
  studentStructureT,
  socialStructureT,
  dataUnitT,
  dataUnitStructT,
  structureDefT,
  payloadT,
  activityDataT,
  ObjectT,
  GlobalStructureT,
  ActivityRunnerT,
  ActivityRunnerPropsT,
  ActivityPackageT,
  productOperatorT,
  socialOperatorT,
  operatorPackageT,
  controlOperatorT,
  ControlStructureT,
  controlOperatorRunnerT,
  socialOperatorRunnerT,
  productOperatorRunnerT,
  ControlT,
  LogT,
  LogDbT,
  DashboardT,
  DashboardViewerPropsT,
  LIComponentPropsT,
  LIRenderT,
  LearningItemComponentT,
  LearningItemT
} from './types';
export { CountChart } from './DashboardComponents/CountChart';

export { default as withDragDropContext } from './withDragDropContext';

export {
  default as TableView,
  toTableData
} from './ActivityComponents/TableView';
export { default as TreeView } from './ActivityComponents/TreeView';
// Exports for Dashboards
export { default as ProgressDashboard } from './dashboards/progress';
export { default as LeaderBoard } from './dashboards/leaderboard';
export { default as CoordinatesDashboard } from './dashboards/coordinates';

export { A } from './A';

export { currentDate } from './currentDate';

export { highlightSearchHTML } from './highlightSearchHTML';
export { HighlightSearchText } from './HighlightSearchText';
export { highlightTargetRichText } from './highlightTargetRichText';

export { booleanize } from './booleanize';

export { shorten, shortenRichText } from './shorten';

export { notEmpty } from './notEmpty';

export { splitAt } from './splitAt';

export { zipList } from './zipList';

export { withVisibility } from './withVisibility';

export { flattenOne } from './flattenOne';

export { wordWrap } from './wordWrap';

export { getSlug } from './getSlug';

export { splitPathObject } from './splitPathObject';

export { getDisplayName } from './getDisplayName';

export { getInitialState } from './getInitialState';

export { cloneDeep } from './cloneDeep';

export { isEqualLI } from './isEqualLI';

export { Inspector } from './Inspector';

export { entries, values } from './toArray';

export { WikiContext } from './WikiContext';

export { EmbedlyCache, getEmbedlyCache } from './EmbedlyCache';

export { getRotateable } from './getRotateable';
