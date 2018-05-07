import React from 'react';
import Dialog from 'material-ui/Dialog';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from 'material-ui/transitions/Slide';
import List from 'material-ui/List';
import IconButton from 'material-ui/IconButton';

const Transition = props => <Slide direction="up" {...props} />;

const HelpModal = ({ show, hide }) => (
  <Dialog open={show} onClose={hide} transition={Transition}>
    <AppBar>
      <Toolbar>
        <IconButton color="inherit" onClick={hide} aria-label="Close">
          <CloseIcon />
        </IconButton>
        <Typography variant="title" color="inherit">
          Help for the graph editor
        </Typography>
      </Toolbar>
    </AppBar>
    <List style={{ margin: '10px' }}>
      <h4>Adding activities</h4>
      Double-click on one of the three plane lines to add activities. Choose the
      kind of activity, and configure it, in the right sidebar.
      <h4>Renaming activities</h4>
      Double-click on an activity to rename it.
      <h4>Moving or resizing activities</h4>
      Move the cursor over an activity until the mouse cursor turns into a
      cross. Click and drag the activity to where you want it. You will see
      indicators showing you the time between the activity you are dragging, and
      the previous or next activity, or the beginning/end of the class.
      <p />
      To resize, move the cursor to the end of the activity, until it turns into
      a two-ways arrow, and click and hold while dragging to resize the
      activity.
      <p />
      To change the plane, first select the activity, then press Shift+up if you
      want the activity to go to a higher plane or Shift-down to make it go to a
      lower plane.
      <p />
      To copy an activity, press + while an activity is selected. A copy will be
      placed on top (or below) of the selected activity. You can now change
      planes, or drag it somewhere else in the graph.
      <h4>Inserting operators</h4>
      To insert an operator, click S for a social operator, P for a product
      operator, or C for a control operator (the mouse must be over the main
      graph view). An operator will appear attached to the mouse. Move the mouse
      to where you want to locate the operator, and click to place it. When you
      select an operator, you can configure it in the right sidebar. Shift+click
      and drag on the operator to reposition it.
      <h4>Connections</h4>
      To create a connection from an activity, move the mouse cursor to the
      small circle at the right side of the box, until the mouse cursor becomes
      a crosshair. Click, and drag to the activity or operator you want to
      connect. To begin a connection from an operator, click on an operator and
      drag to the operator or activity you wish to connect.
      <h4>Deleting elements</h4>
      To delete an element, select it (it will change color to red), and press
      the backspace key, while your cursor is over the main graph window.
      <h4>Undo</h4>
      All your actions are immediately stored in the database. To undo, click
      the undo button at the bottom of the graph.
      <h4>Resizing automatically</h4>
      <b>r</b> jumps between two states: resize all activities to be five
      minutes long, and restore their original sizes
      <h4>Organizing automatically</h4>
      <b>z</b> jumps between three states: move all activities next to each
      other, put five minutes distance between all activities, and restore
      original positions
    </List>
  </Dialog>
);

export default HelpModal;
