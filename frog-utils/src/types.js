// @flow

export type ActivityDbT = {
  _id: string,
  data: Object,
  groupingKey: string,
  plane: number,
  startTime: number,
  length: number,
  activityType: string,
  actualStartingTime?: Date
};

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

export type ActivityRunnerT = {
  logger: (log: LogT) => void,
  activityData: dataUnitStructT,
  data: any,
  dataFn: Object,
  stream: (value: any, path: string[]) => void,
  uploadFn: (files: Array<any>, name: string) => Promise<*>,
  userInfo: { id: string, name: string },
  groupingValue: string
};

export type validateConfigFnT = Object => null | {
  field?: string,
  err: string
};

export type ReactComponent<Props> =
  | Class<React$Component<Props, *>>
  | (Props => React$Element<any> | null | React$Element<any>[]);

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

type LogExtraDBT = {|
  _id: string,
  sessionId: string,
  userId: string,
  instanceId?: string,
  timestamp: Date
|} & LogT;

export type LogDBT =
  | {| ...LogExtraDBT, ...ActivityDefT, ...LogT |}
  | {| ...LogExtraDBT, ...LogT |};

export type ActivityPackageT = {
  id: string,
  type: 'react-component',
  meta: {
    name: string,
    shortName?: string,
    shortDesc: string,
    description: string,
    exampleData?: { title: string, config?: Object, data?: any }[]
  },
  config: Object,
  configUI?: Object,
  dataStructure?: any,
  validateConfig?: validateConfigFnT[],
  mergeFunction?: (dataUnitStructT, Object) => void,
  ActivityRunner: React$Component<ActivityRunnerT>,
  dashboard?: { [name: string]: dashboardT },
  exportData?: (config: Object, product: activityDataT) => string,
  formatProduct?: (config: Object, item: any) => any,
  ConfigComponent?: React$Component<{
    configData: Object,
    setConfigData: Object => void
  }>
};

export type dashboardT = {
  Viewer: ReactComponent<dashboardViewerPropsT>,
  mergeLog: (state: any, log: LogDBT, activity: ActivityDbT) => void,

  exampleLogs?: { title: string, path: string }[],
  exampleData?: { title: string, path: string }[],
  initData: any
};

export type dashboardViewerPropsT = {
  users: Array<Object>,
  activity: ActivityDbT,
  instances: Array<string>,
  state: any,
  config: Object
};

export type productOperatorT = {
  id: string,
  type: 'product',
  meta: {
    name: string,
    shortName?: string,
    shortDesc: string,
    description: string
  },
  config: Object,
  configUI?: Object,
  validateConfig?: validateConfigFnT[],
  operator: (
    configData: Object,
    object: ObjectT & GlobalStructureT
  ) => activityDataT
};

export type controlOperatorT = {
  id: string,
  type: 'control',
  meta: {
    name: string,
    shortName?: string,
    shortDesc: string,
    description: string
  },
  config: Object,
  configUI?: Object,
  validateConfig?: validateConfigFnT[],
  operator: (
    configData: Object,
    object: ObjectT & GlobalStructureT
  ) => ControlStructureT
};

export type socialOperatorT = {
  id: string,
  type: 'social',
  meta: {
    name: string,
    shortName?: string,
    shortDesc: string,
    description: string
  },
  outputDefinition: string[] | ((config: Object) => string[]),
  validateConfig?: validateConfigFnT[],
  config: Object,
  configUI?: Object,
  operator: (
    configData: Object,
    object: ObjectT & GlobalStructureT
  ) => socialStructureT
};

export type operatorPackageT =
  | socialOperatorT
  | productOperatorT
  | controlOperatorT;
