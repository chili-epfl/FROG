// @flow

export const sessionState = (session: Object) => ({
  isWaitingForStudents: session.timeInGraph === -1,
  isPaused: session.state === 'PAUSED'
});
