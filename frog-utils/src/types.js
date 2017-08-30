// @flow

export type ActivityDbT = {
  _id: string,
  data: Object,
  groupingKey: string,
  plane: number
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
  activityData: activityDataT,
  globalStructure: { studentIds: string[] }
};

export type ControlT = {
  structure: structureDefT,
  payload: {
    [attributeKey: string]: true
  }
};

export type ControlStructureT =
  | { 'all': ControlT }
  | { [activityId: string]: ControlT };

export type ActivityRunnerT = {
  logger: Function, // logging callback
  activityData: dataUnitStructT,
  data: any,
  dataFn: Object,
  uploadFn: (files: Array<any>, callback: (string) => any) => void,
  userInfo: { id: string, name: string }
};

export type validateConfigFnT = Object => null | { field: string, err: string };

export type ActivityPackageT = {
  id: string,
  type: 'react-component',
  meta: {
    name: string,
    shortDesc: string,
    description: string,
    exampleData: Array<any>
  },
  config: Object,
  validateConfig?: validateConfigFnT[],
  mergeFunction?: (dataUnitStructT, Object) => void,
  ActivityRunner: (x: ActivityRunnerT) => React$Component<*> | React$Element<*>
};

export type productOperatorT = {
  id: string,
  type: 'product',
  meta: {
    name: string,
    shortDesc: string,
    description: string
  },
  config: Object,
  validateConfig?: validateConfigFnT[],
  operator: (configData: Object, object: ObjectT) => activityDataT
};

export type controlOperatorT = {
  id: string,
  type: 'control',
  meta: {
    name: string,
    shortDesc: string,
    description: string
  },
  config: Object,
  validateConfig?: validateConfigFnT[],
  operator: (configData: Object, object: ObjectT) => ControlStructureT
};

export type socialOperatorT = {
  id: string,
  type: 'social',
  meta: {
    name: string,
    shortDesc: string,
    description: string
  },
  outputDefinition: string[] | ((config: Object) => string[]),
  validateConfig?: validateConfigFnT[],
  config: Object,
  operator: (configData: Object, object: ObjectT) => socialStructureT
};

export type operatorPackageT =
  | socialOperatorT
  | productOperatorT
  | controlOperatorT;
