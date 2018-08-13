// @flow

import * as React from 'react';
import type { Doc } from './generateReactiveFn';

export type ActivityDbT = {|
  _id: string,
  data: Object,
  title?: string,
  groupingKey?: string,
  plane?: number,
  startTime: number,
  length: number,
  activityType: string,
  actualStartingTime?: Date,
  actualClosingTime?: Date,
  parentId?: string
|};

export type DashboardDataDbT = {|
  dashId: string,
  data: any
|};

export type OperatorDbT = {
  _id: string,
  type: string,
  data: Object
};

// { aa: { group: 1, role: 'chef', color: 'red' },
//   bb: { group: 2, role: 'waiter' },
//   cc: { role: 'waiter' } }
export type studentStructureT = {
  [studentId: string]: { [attributeKey: string]: string }
};

// { group: { '1': [ 'aa ' ], '2': [ 'bb' ] },
//   role: { chef: [ 'aa' ], waiter: [ 'bb', 'cc' ] },
//   color: { red: 'aa' } }
export type socialStructureT = {
  [attributeKey: string]: {
    [attributeValue: string]: string[]
  }
};

export type dataUnitT = any;

export type dataUnitStructT = { config: Object, data: dataUnitT };

export type structureDefT = { groupingKey: string } | 'individual' | 'all';

export type payloadT = { [attributeKey: string]: dataUnitStructT };

export type activityDataT = {
  structure: structureDefT,
  payload: payloadT
};

export type ObjectT = {
  socialStructure: socialStructureT,
  activityData: activityDataT
};

export type GlobalStructureT = {
  globalStructure: {
    studentIds: string[],
    students: { [studentId: string]: string }
  }
};

export type ControlT = {
  structure: structureDefT,
  mode: 'include' | 'exclude',
  payload: {
    [attributeKey: string]: true
  }
};

export type ControlStructureT =
  | { all: ControlT }
  | { list: { [activityId: string]: ControlT } };

export type ActivityRunnerPropsT = {
  logger: (logs: LogT | LogT[]) => void,
  activityData: dataUnitStructT,
  data: any,
  dataFn: Object,
  stream: (value: any, path: string[]) => void,
  uploadFn: (files: Array<any>, name: string) => Promise<*>,
  userInfo: { id: string, name: string },
  activityId: string,
  groupingValue: string,
  sessionId: string
};

export type ActivityRunnerT = React.ComponentType<ActivityRunnerPropsT>;

export type validateConfigFnT = Object => null | {
  field?: string,
  err: string
};

export type LogT = {|
  type: string,
  itemId?: string,
  value?: string | number,
  payload?: Object
|};

type ActivityDefT = {|
  activityId: string,
  activityType: string,
  activityPlane: number
|};

type LogExtraT = {|
  sessionId: string,
  userId: string,
  instanceId: string,
  timestamp: Date
|} & LogT;

export type LogDbT =
  | {| ...LogExtraT, ...ActivityDefT, ...LogT, _id: string |}
  | {| ...LogExtraT, ...LogT, _id: string |};

export type ActivityPackageT = {
  id: string,
  type: 'react-component',
  configVersion: number,
  upgradeFunctions?: { [version: string]: (Object) => Object },
  meta: {
    name: string,
    shortName?: string,
    shortDesc: string,
    description: string,
    exampleData?: {
      title: string,
      config?: Object,
      data?: any,
      learningItems?: any,
      type?: 'deeplink'
    }[],
    preview?: boolean
  },
  config: Object,
  configUI?: Object,
  dataStructure?: any,
  validateConfig?: validateConfigFnT[],
  mergeFunction?: (dataUnitStructT, Object) => void,
  dashboards?: { [name: string]: DashboardT },
  exportData?: (config: Object, product: activityDataT) => string,
  formatProduct?: (
    config: Object,
    item: any,
    instanceId: string,
    username?: string
  ) => any,
  ConfigComponent?: React.ComponentType<{
    configData: Object,
    setConfigData: Object => void,
    formContext: Object
  }>,
  LearningItems?: LearningItemT<*>[]
};

export type DashboardT = {
  Viewer: React.ComponentType<DashboardViewerPropsT>,
  mergeLog: (state: any, log: LogDbT, activity: ActivityDbT) => void,
  prepareDataForDisplay?: (state: any, activity: ActivityDbT) => any,
  reactiveToDisplay?: (reactive: any, activity: ActivityDbT) => any,
  initData: any,
  exampleLogs?: (
    | {
        type: 'logs',
        title: string,
        path: string,
        activityMerge?: Object,
        instances?: number
      }
    | { title: string, type: 'state', activityMerge?: Object, state: any }
  )[],
  exampleData?: { title: string, path: string }[]
};

export type DashboardViewerPropsT = {
  users: { [uid: string]: string },
  activity: ActivityDbT,
  instances: Array<string>,
  state: any
};

export type productOperatorT = {
  id: string,
  type: 'product',
  configVersion: number,
  upgradeFunctions?: { [version: string]: (Object) => Object },
  external?: boolean,
  meta: {
    name: string,
    shortName?: string,
    shortDesc: string,
    description: string
  },
  config: Object,
  configUI?: Object,
  validateConfig?: validateConfigFnT[],
  LearningItems?: LearningItemT<*>[]
};

export type controlOperatorT = {
  id: string,
  type: 'control',
  configVersion: number,
  upgradeFunctions?: { [version: string]: (Object) => Object },
  external?: boolean,
  meta: {
    name: string,
    shortName?: string,
    shortDesc: string,
    description: string
  },
  config: Object,
  configUI?: Object,
  validateConfig?: validateConfigFnT[]
};

export type socialOperatorT = {
  id: string,
  type: 'social',
  configVersion: number,
  upgradeFunctions?: { [version: string]: (Object) => Object },
  external?: boolean,
  meta: {
    name: string,
    shortName?: string,
    shortDesc: string,
    description: string
  },
  outputDefinition: string[] | ((config: Object) => string[]),
  validateConfig?: validateConfigFnT[],
  config: Object,
  configUI?: Object
};

export type operatorPackageT =
  | socialOperatorT
  | productOperatorT
  | controlOperatorT;

export type productOperatorRunnerT = (
  configData: Object,
  object: ObjectT & GlobalStructureT
) => activityDataT | Promise<activityDataT>;

export type controlOperatorRunnerT = (
  configData: Object,
  object: ObjectT & GlobalStructureT
) => ControlStructureT;

export type socialOperatorRunnerT = (
  configData: Object,
  object: ObjectT & GlobalStructureT
) => socialStructureT;

export type CursorT<T> = {
  fetch: () => T[],
  map: T => void,
  forEach: T => void,
  observe: Object => void,
  observeChanges: Object => void
};

type UpdateQueryT<T> = {
  $set?: $Shape<T>,
  $inc?: { [key: $Keys<T>]: number },
  $unset?: { [key: $Keys<T>]: any }
};
export type MongoT<T> = {
  find: (
    string | $Shape<T> | { [$Keys<T>]: { $in: any } },
    ?Object
  ) => CursorT<T>,
  findOne: (string | $Shape<T>, ?Object) => ?T,
  update: (string | $Shape<T>, UpdateQueryT<T>) => void,
  insert: (T, ?(T) => void) => string
};

type LIRenderPropsT = {|
  children: React.Element<*>,
  editable: Boolean,
  zoomable: Boolean,
  liType: string
|};

export type LIRenderT = React.ComponentType<LIRenderPropsT>;
type ImmutableLIT = { id: string, liDocument: Object };

export type LIComponentPropsT =
  | {| type: 'history', id: string, render?: LIRenderT |}
  | {|
      type: 'create',
      meta?: Object,
      liType?: string,
      onCreate?: Function,
      autoInsert?: Boolean,
      meta?: Object
    |}
  | {| type: 'view', id: string | ImmutableLIT, render?: LIRenderT |}
  | {|
      type: 'thumbView',
      id: string | ImmutableLIT,
      render?: LIRenderT,
      clickZoomable?: boolean
    |}
  | {|
      type: 'edit',
      id: string,
      render?: React.ComponentType<{ ...{| dataFn: Doc |}, ...LIRenderPropsT }>
    |};

export type LearningItemComponentT = React.ComponentType<LIComponentPropsT>;

export type LearningItemT<T> = {
  name: string,
  id: string,
  dataStructure?: T,
  Editor?: React.ComponentType<{
    data: T,
    dataFn: Doc,
    LearningItem: LearningItemComponentT
  }>,
  Creator?: React.ComponentType<{
    createLearningItem: Function,
    LearningItem: LearningItemComponentT
  }>,
  ThumbViewer?: React.ComponentType<{
    data: T,
    LearningItem: LearningItemComponentT
  }>,
  Viewer?: React.ComponentType<{
    data: T,
    LearningItem: LearningItemComponentT
  }>
};
