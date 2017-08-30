// @flow
//
import React from 'react';
import { cloneDeep, uniqBy } from 'lodash';
import Stringify from 'json-stable-stringify';
import { A } from 'frog-utils';
import Modal from 'react-modal';
import { Nav, NavItem } from 'react-bootstrap';
import { withState, compose } from 'recompose';
import { Inspector } from 'react-inspector';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';

import { activityTypesObj } from '../../activityTypes';
import ReactiveHOC from '../StudentView/ReactiveHOC';

const ShowInfo = ({ activityData, data }) => (
  <div style={{ display: 'flex', justifyContent: 'space-around' }}>
    <div style={{ flexBasis: 0, flexGrow: 1 }}>
      <h3>Config</h3>
      <Inspector data={activityData.config} expandLevel={8} />
    </div>
    <div style={{ flexBasis: 0, flexGrow: 1, marginLeft: '50px' }}>
      <h3>activityData</h3>
      <Inspector data={activityData.data} expandLevel={8} />
    </div>
    <div style={{ flexBasis: 0, flexGrow: 1, marginLeft: '50px' }}>
      <h3>Current reactive data</h3>
      <Inspector data={data} expandLevel={8} />
    </div>
  </div>
);

export const StatelessPreview = ({
  activityTypeId,
  example,
  setExample,
  showData,
  setShowData,
  dismiss,
  config,
  isSeparatePage = false
}: {
  activityTypeId: string,
  example: number,
  setExample: Function,
  showData: boolean,
  setShowData: Function,
  dismiss?: Function,
  config?: Object,
  isSeparatePage: boolean
}) => {
  const activityType = activityTypesObj[activityTypeId];

  const RunComp = activityType.ActivityRunner;
  RunComp.displayName = activityType.id;

  const examples = config
    ? uniqBy(activityType.meta.exampleData, x => Stringify(x.data))
    : activityType.meta.exampleData;

  const activityData = cloneDeep(examples[example]);
  if (config) {
    activityData.config = config;
  }
  const ActivityToRun = ReactiveHOC(
    cloneDeep(activityType.dataStructure || {}),
    'demo/' + activityType.id + '/' + example,
    activityType,
    activityData
  )(showData ? ShowInfo : RunComp);

  return (
    <Modal
      contentLabel={'Preview of ' + activityType.id}
      isOpen
      onRequestClose={dismiss || (() => null)}
    >
      <div className="modal-header">
        <button type="button" className="close" onClick={dismiss}>
          X
        </button>

        <h4 className="modal-title">
          Preview of {activityType.meta.name} ({activityType.id}){' '}
          <A onClick={() => setShowData(!showData)}>
            (show {showData ? 'activity' : 'underlying data'})
          </A>{' '}
          {!isSeparatePage && (
            <Link to={`/preview/${activityTypeId}/${example}`}>
              (Open in separate window)
            </Link>
          )}
        </h4>
        <Nav bsStyle="pills" activeKey={example}>
          {examples.map((x, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <NavItem key={i} eventKey={i} onClick={() => setExample(i)}>
              {x.title}
            </NavItem>
          ))}
        </Nav>
      </div>
      <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
        <ActivityToRun
          activityData={activityData}
          userInfo={{ name: Meteor.user().username, id: Meteor.userId() }}
          logger={() => {}}
        />
      </div>
    </Modal>
  );
};

const StatefulPreview = compose(
  withState('example', 'setExample', 0),
  withState('showData', 'setShowData', false)
)(StatelessPreview);

StatefulPreview.displayName = 'StatefulPreview';
export default StatefulPreview;
