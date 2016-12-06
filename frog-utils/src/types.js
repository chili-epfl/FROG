// @flow
export type ActivityRunnerT = {
  config: Object,  // result of running config function from activity package
  logger: Function, // logging callback
  onCompletion: Function, // call on completion, with student data as argument
  data: Object // data from operator
}

export type ActivityPackageT = {
	id: string,
	meta: {type: string, name: string},
	config: Object,
	ActivityRunner: ((x: ActivityRunnerT) => React$Component<*>)
}
