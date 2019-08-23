// @flow

export const sessionState = (session: Object) => ({
  slug: session.slug,
  isWaitingForStudents: session.timeInGraph === -1,
  isPaused: session.state === 'PAUSED',
  settings: session.settings
});
