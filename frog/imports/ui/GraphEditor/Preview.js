import React from 'react';
import { cloneDeep } from 'lodash';
import { uuid } from 'frog-utils';
import Modal from 'react-modal';
import { Nav, NavItem } from 'react-bootstrap';
import { withState } from 'recompose';

import { activityTypesObj } from '../../activityTypes';
import { connection } from '../App/index';
import ReactiveHOC from '../StudentView/ReactiveHOC';
import doGetInstances from '../../api/doGetInstances';

export default withState(
  'example',
  'setExample',
  0
)(({ activityTypeId, example, setExample, dismiss }) => {
  const activityType = activityTypesObj[activityTypeId || 'ac-chat'];
  const RunComp = activityType.ActivityRunner;
  RunComp.displayName = activityType;
  const ActivityToRun = ReactiveHOC(
    cloneDeep(activityType.dataStructure),
    uuid(),
    activityType.meta.exampleData[example].activityData
  )(RunComp);

  const data = {
    config: activityType.meta.exampleData[example].config,
    activityData: activityType.meta.exampleData[example].activityData
  };

  return (
    <Modal
      contentLabel={'Preview of ' + activityType.id}
      isOpen
      onRequestClose={dismiss}
    >
      <div className="modal-header">
        <button type="button" className="close" onClick={dismiss}>
          X
        </button>

        <h4 className="modal-title">
          Preview of {activityType.meta.name} ({activityType.id})
        </h4>
        <Nav bsStyle="pills" activeKey={example}>
          {activityType.meta.exampleData.map((x, i) =>
            <NavItem key={i} eventKey={i} onClick={() => setExample(i)}>
              {x.title}
            </NavItem>
          )}
        </Nav>
      </div>
      <div style={{ width: '100%', height: '100%' }}>
        <ActivityToRun
          activityData={data}
          userInfo={{ name: Meteor.user().username, id: Meteor.userId() }}
          logger={() => {}}
        />
      </div>
    </Modal>
  );
});
