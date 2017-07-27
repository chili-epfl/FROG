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

export type dataUnitT = Object | any[];

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

export type ActivityRunnerT = {
  logger: Function, // logging callback
  activityData: dataUnitStructT,
  data: any,
  dataFn: Object,
  userInfo: { id: string, name: string }
};

export type ActivityPackageT = {
  id: string,
  meta: {
    type: string,
    name: string,
    shortDesc: string,
    description: string,
    exampleData: Array<any>
  },
  config: Object,
  mergeFunction?: (dataUnitStructT, Object) => void,
  ActivityRunner: (x: ActivityRunnerT) => React$Component<*> | React$Element<*>
};

export type productOperatorT = {
  id: string,
  meta: {
    type: string,
    name: string,
    shortDesc: string,
    description: string
  },
  config: Object,
  operator: (configData: Object, object: ObjectT) => activityDataT
};

export type socialOperatorT = {
  id: string,
  meta: {
    type: string,
    name: string,
    shortDesc: string,
    description: string
  },
  config: Object,
  operator: (configData: Object, object: ObjectT) => socialStructureT
};

export type operatorPackageT = socialOperatorT | productOperatorT;
