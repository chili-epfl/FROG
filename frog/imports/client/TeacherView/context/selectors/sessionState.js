// @flow

export const sessionState = (session: Object) => ({
  id: session._id,
  slug: session.slug,
  isWaitingForStudents: session.timeInGraph === -1,
  isPaused: session.state === 'PAUSED',
  settings: session.settings,
  ownerId: session.ownerId,
  singleActivity: session.singleActivity
});
