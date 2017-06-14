// @flow

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
    [attributeName: string]: string[]
  }
};

export type dataUnitT = Object | any[];

export type dataUnitStructT = { config?: Object, data?: dataUnitT };

export type structureDefT = { groupingKey: string } | 'individual' | 'all';

export type payloadT = { [attributeKey: string]: dataUnitStructT };

export type activityDataT = { structure: structureDefT, payload: payloadT };

export type ObjectT = {
  socialStructure: socialStructureT,
  activityData: activityDataT,
  globalStructure: { studentIds: string[] }
};

export type ActivityRunnerT = {
  object: ObjectT, // Data computed from the connected operators and activities
  logger: Function, // logging callback
  saveProduct: (userId: string, data: Object) => void, // call on completion, with student data as argument
  data: any,
  dataFn: Function,
  userInfo: { id: string, name: string }
};

export type ActivityPackageT = {
  id: string,
  meta: { type: string, name: string },
  config: Object,
  ActivityRunner: (x: ActivityRunnerT) => React$Component<*> | React$Element<*>
};

export type productOperatorT = {
  id: string,
  meta: { type: string, name: string },
  config: Object,
  operator: (
    configData: Object,
    object: ObjectT
  ) => {
    activityData: activityDataT
  }
};

export type socialOperatorT = {
  id: string,
  meta: { type: string, name: string },
  config: Object,
  operator: (
    configData: Object,
    object: ObjectT
  ) => {
    socialStructure: socialStructureT
  }
};
