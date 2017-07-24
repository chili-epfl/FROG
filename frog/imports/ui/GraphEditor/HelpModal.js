import React from 'react';
import { Modal } from 'react-bootstrap';
import { connect } from './store';

const HelpModal = ({ show, hide }) =>
  <Modal show={show} onHide={hide}>
    <Modal.Header closeButton>
      <Modal.Title>Graph Editor Help</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <h4>Adding activities</h4>
      Double-click on one of the three plane lines to add activities. Choose the
      kind of activity, and configure it, in the right sidebar.
      <h4>Renaming activities</h4>
      Double-click on an activity to rename it.
      <h4>Moving or resizing activities</h4>
      Move the cursor over an activity until the mouse cursor turns into a
      cross. Click and drag the activity to where you want it. The activity
      cannot overlap in time with any other activity (even if they are on
      another plane). You will see indicators showing you the time between the
      activity you are dragging, and the previous or next activity, or the
      beginning/end of the class. If you drag one activity against another one,
      and keep dragging, the two activities will change places.
      <p />
      To resize, move the cursor to the end of the activity, until it turns into
      a two-ways arrow, and click and hold while dragging to resize the
      activity. You cannot resize the activity past the beginning of the next
      activity, even if it is on another plane.
      <h4>Inserting operators</h4>
      To insert a social operator, click S, or click P to insert a product
      operator (the mouse must be over the main graph view). An operator will
      appear attached to the mouse. Move the mouse to where you want to locate
      the operator, and click to place it. When you select an operator, you can
      configure it in the right sidebar. Shift+click and drag on the operator to
      reposition it.
      <h4>Connections</h4>
      To create a connection from an activity, move the mouse cursor to the
      small circle at the right side of the box, until the mouse cursor becomes
      a crosshair. Click, and drag to the activity or operator you want to
      connect. To begin a connection from an operator, click on an operator and
      drag to the operator or activity you wish to connect.
      <h4>Deleting elements</h4>
      To delete an element, select it (it will change color to red), and click
      the delete button, while your cursor is over the main graph window.
      <h4>Undo</h4>
      All your actions are immediately stored in the database. To undo, click
      the undo button at the bottom of the graph.
    </Modal.Body>
  </Modal>;

export default connect(({ store: { ui: { showModal, setModal } } }) =>
  <HelpModal show={showModal} hide={() => setModal(false)} />
);
