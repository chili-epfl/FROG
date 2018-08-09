const changelog = [
  {
    'Adding activities': `Double-click on one of the three plane lines to add activities. Choose the
    kind of activity, and configure it, in the right sidebar.`,
    'Renaming activities': `Double-click on an activity to rename it.`,
    'Moving or resizing activities': `Move the cursor over an activity until the mouse cursor turns into a
    cross. Click and drag the activity to where you want it. You will see
    indicators showing you the time between the activity you are dragging, and
    the previous or next activity, or the beginning/end of the class.
    <br/>
    To resize, move the cursor to the end of the activity, until it turns into
    a two-ways arrow, and click and hold while dragging to resize the
    activity.
    <br/>
    To change the plane, first select the activity, then press Shift+up if you
    want the activity to go to a higher plane or Shift-down to make it go to a
    lower plane.
    <br/>
    To copy an activity, press + while an activity is selected. A copy will be
    placed on top (or below) of the selected activity. You can now change
    planes, or drag it somewhere else in the graph.`,
    'Inserting operators': `To insert an operator, click S for a social operator, P for a product
    operator, or C for a control operator (the mouse must be over the main
    graph view). An operator will appear attached to the mouse. Move the mouse
    to where you want to locate the operator, and click to place it. When you
    select an operator, you can configure it in the right sidebar. Shift+click
    and drag on the operator to reposition it.`,
    Connections: `To create a connection from an activity, move the mouse cursor to the
    small circle at the right side of the box, until the mouse cursor becomes
    a crosshair. Click, and drag to the activity or operator you want to
    connect. To begin a connection from an operator, click on an operator and
    drag to the operator or activity you wish to connect.`,
    'Deleting elements': `To delete an element, select it (it will change color to red), and press
    the backspace key, while your cursor is over the main graph window.`,
    Undo: `All your actions are immediately stored in the database. To undo, click
    the undo button at the bottom of the graph.`,
    'Resizing automatically': `'r' jumps between two states: resize all activities to be five
    minutes long, and restore their original sizes`,
    'Organizing automatically': `'z' jumps between three states: move all activities next to each
    other, put five minutes distance between all activities, and restore
    original positions`
  },
  {
    'new activity': `This is a big change`
  },
  {
    'new operator': `This is another big change`
  }
];

export default changelog;

export const updateChangelogVersion = () => {
  Meteor.users.update(Meteor.userId(), {
    $set: { 'profile.lastVersionChangelog': changelog.length - 1 }
  });
};
