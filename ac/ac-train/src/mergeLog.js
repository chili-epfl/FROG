import { times, constant } from 'lodash';

const mergeLog = (data, dataFnRaw, log, config) => {
  const state = data.logs;
  const dataFn = dataFnRaw.specialize('logs');

  if (log.type === 'answer' && log.payload) {
    const { iterationPerInterface } = config;

    const { whichInterface, iteration, isCorrect, timeTaken } = log.payload;

    const iterationOnInterface = iteration % iterationPerInterface;

    // Ensure initialization of state
    ['error', 'count', 'time'].forEach(type => {
      if (!state[type][whichInterface]) {
        dataFn.objInsert(times(iterationPerInterface, constant(0)), [
          type,
          whichInterface
        ]);
      }
      if (!state['sum'][type]) {
        dataFn.objInsert(times(4 * iterationPerInterface, constant(0)), [
          'sum',
          type
        ]);
      }
    });

    // Increment desired values
    if (!isCorrect) {
      dataFn.numIncr(1, ['error', whichInterface, iterationOnInterface]);
      dataFn.numIncr(1, ['sum', 'error', iteration]);
    }

    dataFn.numIncr(1, ['count', whichInterface, iterationOnInterface]);
    dataFn.numIncr(1, ['sum', 'count', iteration]);

    dataFn.numIncr(timeTaken / 1000, [
      'time',
      whichInterface,
      iterationOnInterface
    ]);
    dataFn.numIncr(timeTaken / 1000, ['sum', 'time', iteration]);
  }

  if (log.type === 'help' && log.payload) {
    const { whichInterface } = log.payload;
    if (!state['help'][whichInterface]) {
      dataFn.objInsert(0, ['help', whichInterface]);
    }
    dataFn.numIncr(1, ['help', whichInterface]);
  }
};

export default mergeLog;
