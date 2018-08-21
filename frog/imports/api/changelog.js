const changelog = [
  {
    date: new Date('08/21/2018'),
    'Integrated changelog':
      'FROG will now tell you on login about any significant new features that have been added since the last time you logged on'
  }
];

export default changelog;

export const updateChangelogVersion = () => {
  Meteor.users.update(Meteor.userId(), {
    $set: { 'profile.lastVersionChangelog': changelog.length - 1 }
  });
};
