const changelog = [
  {
    date: new Date('08/21/2018'),
    title: 'Integrated changelog',
    content: [
      'FROG will now tell you on login about any significant new features that have been added since the last time you logged on'
    ]
  },
  {
    date: new Date('09/18/2018'),
    title: 'Easier login for multiple users, and URL change',
    content: [
      'If you use ?login=name to log in, it will now store that user in the sessionStorage, which is local to each tab. This means that you can keep multiple users logged in for testing, without worrying about reloading. This only applies when you log in using the ?login= method.',
      'We have changed the URL structure of the Session tab, now the SLUG of the session is displayed, instead of the UUID.'
    ]
  },
  {
    date: new Date('09/24/2018'),
    title: 'Improvements in Brainstorm and Single-LI',
    content: [
      'The Brainstorm activity has gained a lot of new options, and we fixed some bugs. The configurations of existing graphs should be automatically upgraded, but make sure to check.',
      'We added an option to Single-LI to immediately create a LI, and not require students to submit. Note that this can result in empty LIs being sent to other activities/operators.'
    ]
  }
];

export default changelog;

export const updateChangelogVersion = () => {
  Meteor.users.update(Meteor.userId(), {
    $set: { 'profile.lastVersionChangelog': changelog.length - 1 }
  });
};
