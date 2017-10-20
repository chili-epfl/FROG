// @flow
import { type LogT, type LogDBT, uuid } from 'frog-utils';

export const Logs: LogDBT[] = [];

const createLogger = (
  sessionId: string,
  instanceId: string,
  activityType: string,
  userId: string,
  callback: LogDBT => void
) => {
  const logger = (logItem: LogT) => {
    const log = ({
      _id: uuid(),
      userId,
      sessionId,
      activityType,
      activityId: 'preview',
      instanceId,
      timestamp: new Date(),
      ...logItem
    }: LogDBT);
    Logs.push(log);
    callback(log);
    return log;
  };
  return logger;
};

export default createLogger;
