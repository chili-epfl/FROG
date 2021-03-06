// @flow

import * as React from 'react';

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
  parentId?: string,
  template?: { rz: Object, lis?: Object, duplicate?: boolean }
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
  userInfo: { id: string, name: string, role: string },
  activityId: string,
  groupingValue: string,
  sessionId: string,
  instanceMembers: string[]
};

export type ActivityRunnerT = React.ComponentType<ActivityRunnerPropsT>;

export type validateConfigFnT = Object => null | {
  field?: string,
  err: string
};

export type LogT = {|
  type: string,
  itemId?: string,
  value?: string | number | Array<any>,
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
    supportsLearningItems?: boolean,
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
  dataStructure?: Object | Function,
  validateConfig?: validateConfigFnT[],
  mergeFunction?: (
    dataUnitStructT,
    Object,
    any,
    ?Object
  ) => void | Promise<void>,
  dashboards?: { [name: string]: DashboardT },
  exportData?: (config: Object, product: activityDataT) => string,
  formatProduct?: (
    config: Object,
    item: any,
    instanceId: string,
    username?: string,
    object: Object,
    plane: number
  ) => any,
  ConfigComponent?: React.ComponentType<{
    configData: Object,
    setConfigData: Object => void,
    formContext: Object
  }>,
  LearningItems?: LearningItemT<*>[]
};

export type TemplatePackageT = {
  id: string,
  config: Object,
  type: string,
  meta: {
    name: string,
    shortName?: string,
    shortDesc: string,
    description: string
  },
  makeTemplate: (config: Object) => Object
};

export type DashboardT = {
  displayCondition?: string | ((obj: Object) => boolean),
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
    | { type: 'state', title: string, activityMerge?: Object, state: Object }
  )[],
  exampleData?: { title: string, path: string }[]
};

export type DashboardViewerPropsT = {
  users: { [uid: string]: string },
  activity: ActivityDbT,
  instances: Array<string>,
  state: any,
  object: ObjectT & GlobalStructureT
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
  object: ObjectT & GlobalStructureT,
  LearningItem: Function
) => activityDataT | Promise<activityDataT>;

export type controlOperatorRunnerT = (
  configData: Object,
  object: ObjectT & GlobalStructureT,
  LearningItem: Function
) => ControlStructureT;

export type socialOperatorRunnerT = (
  configData: Object,
  object: ObjectT & GlobalStructureT,
  LearningItem: Function
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
      meta?: Object,
      disableDragging?: boolean
    |}
  | {|
      type: 'createLIPayload',
      meta?: Object,
      liType?: string,
      onCreate?: Function,
      autoInsert?: Boolean,
      meta?: Object,
      payload: Object
    |}
  | {|
      type: 'view',
      id: string | ImmutableLIT,
      render?: LIRenderT,
      search?: string,
      notEmpty?: boolean,
      disableDragging?: boolean
    |}
  | {|
      type: 'thumbView',
      id: string | ImmutableLIT,
      render?: LIRenderT,
      clickZoomable?: boolean,
      search?: string,
      notEmpty?: boolean,
      disableDragging?: boolean
    |}
  | {|
      type: 'edit',
      id: string,
      render?: React.ComponentType<{
        ...{| dataFn: Object |},
        ...LIRenderPropsT
      }>,
      notEmpty?: boolean,
      fallback?: 'view' | 'thumbView',
      disableDragging?: boolean
    |};

export type LearningItemComponentT = React.ComponentType<LIComponentPropsT>;

export type LearningItemT<T> = {
  name: string,
  id: string,
  dataStructure?: T,
  canDropLI?: boolean,
  isEmpty?: (any, Object) => boolean,
  Editor?: React.ComponentType<{
    data: T,
    dataFn: Object,
    LearningItem: LearningItemComponentT,
    search?: string
  }>,
  Creator?: React.ComponentType<{
    createLearningItem: Function,
    LearningItem: LearningItemComponentT,
    search?: string
  }>,
  ThumbViewer?: React.ComponentType<{
    data: T,
    LearningItem: LearningItemComponentT,
    search?: string
  }>,
  Viewer?: React.ComponentType<{
    data: T,
    LearningItem: LearningItemComponentT,
    search?: string
  }>,
  createPayload?: Function,
  search?: (
    data: any,
    search: string,
    dataFn: Object,
    isPlayback?: boolean
  ) => boolean,
  disableDragging?: boolean
};
