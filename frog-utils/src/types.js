// @flow

export type SocialStructureT = {
  [studentId: string]: { [attributeName: string]: string }
};

export type ProductT = {
  nodeId: string,
  userId: string,
  data: Object
};

export type ObjectT = {
  socialStructures: SocialStructureT[],
  products: ProductT[][],
  globalStructure: { studentIds: string[] }
};

export type ActivityRunnerT = {
  configData: Object, // result of running config function from activity package
  object: ObjectT, // Data computed from the connected operators and activities
  logger: Function, // logging callback
  saveProduct: (userId: string, data: Object) => void, // call on completion, with student data as argument
  data: any,
  dataFn: Function,
  data: Object, // data from operator
  userInfo: { id: string, name: string }
};

export type ActivityPackageT = {
  id: string,
  meta: { type: string, name: string },
  config: Object,
  ActivityRunner: (x: ActivityRunnerT) => React$Component<*> | React$Element<*>
};

export type OperatorPackageT = {
  id: string,
  meta: { type: string, name: string },
  config: Object,
  operator: (configData: Object, object: ObjectT) => {
    product: ProductT[],
    socialStructure: SocialStructureT
  }
};

export type ChatT = {
  messages: Array<{ value: { user: string, msg: string }, _id: string }>,
  userInfo: { id: string, name: string },
  addMessage: ({ msg: string, user: string }) => any,
  logger: Function
};
