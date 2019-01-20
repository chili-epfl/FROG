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
  },
  {
    date: new Date('10/04/2018'),
    title: 'Easier debug login, filtering and starring Learning Items',
    content: [
      'There are now three ways of logging in directly from the URL bar, the normal ?login=name, ?debugLogin=name and ?researchLogin=name. The two latter will not write anything to sessionStorage or localStorage, but will keep the query parameter (?debugLogin=...) in the URL, so that if you reload in the same tab, you will be logged in as the same user. We have also added two menu items in the Session menu, "open one student" and "open 3 students", which will open 1/3 tabs with students in the current session. Note that Chrome will block popups, and you need to "trust" FROG in the URL bar.',
      'We now have the possibility of searching Learning Items, and displaying them with search terms highlighted, by passing the search parameter to a LearningItem. This has been implemented as an option in ac-gallery. Ac-gallery has also gained the option to let users star items, and toggle between only showing starred items, or showing all items.'
    ]
  },
  {
    date: new Date('20/01/2019'),
    title: 'Clarifying session settings and cleaning up login screen',
    content: [
      `After user feedback, we've somewhat modified the session settings. First of all, we've made direct user login by name the default (it can still be disabled in the settings). We also explicitly show both the LTI link and the direct login link in the session view - if these are enabled. Within the direct login view, adding your own name is now enabled by default.`,
      `We also added an option to allow late login - this should only be used if there are no group activities, but you are using social structures to distribute content, where there is a default fallback. Test before running with students. We hope to provide a much more flexible mechanism for late-arriving students in the future. We also fixed a bug where students who had already joined a session could not login through the direct link after the graph had passed a social operator.`
    ]
  }
];

export default changelog;

export const updateChangelogVersion = () => {
  Meteor.users.update(Meteor.userId(), {
    $set: { 'profile.lastVersionChangelog': changelog.length - 1 }
  });
};
