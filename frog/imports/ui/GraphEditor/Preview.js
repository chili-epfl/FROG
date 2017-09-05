// @flow

import React from 'react';
import { cloneDeep, uniqBy } from 'lodash';
import Stringify from 'json-stable-stringify';
import { A, generateReactiveFn, uuid } from 'frog-utils';
import Modal from 'react-modal';
import { Nav, NavItem } from 'react-bootstrap';
import { withState, compose } from 'recompose';
import { Inspector } from 'react-inspector';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import ShareDB from 'sharedb';

import { activityTypesObj } from '../../activityTypes';
import ReactiveHOC from '../StudentView/ReactiveHOC';

const ShowInfo = ({ activityData, data }) =>
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
  </div>;

const backend = new ShareDB();
const connection = backend.connect();
const Collections = {};

export const StatelessPreview = withState(
  'reload',
  'setReload',
  ''
)(
  ({
    activityTypeId,
    example,
    setExample,
    showData,
    setShowData,
    dismiss,
    config,
    isSeparatePage = false,
    setReload
  }: {
    activityTypeId: string,
    example: number,
    setExample: Function,
    showData: boolean,
    setShowData: Function,
    dismiss?: Function,
    config?: Object,
    isSeparatePage: boolean,
    setReload: string => void
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

    if (!Collections[`demo-${activityType.id}-${example}`]) {
      Collections[`demo-${activityType.id}-${example}`] = uuid();
    }

    const doc = connection.get(
      'rz',
      Collections[`demo-${activityType.id}-${example}`]
    );
    doc.subscribe();
    doc.on('load', () => {
      doc.create(cloneDeep(activityType.dataStructure) || {});
      const mergeFunction = activityType.mergeFunction;
      if (mergeFunction && activityType.meta.exampleData[example]) {
        const dataFn = generateReactiveFn(doc);
        mergeFunction(
          cloneDeep(activityType.meta.exampleData[example]),
          dataFn
        );
      }
    });

    const ActivityToRun = ReactiveHOC(
      'demo/' + activityType.id + '/' + example,
      doc
    )(showData ? ShowInfo : RunComp);

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
            Preview of {activityType.meta.name} ({activityType.id}){' '}
            <A onClick={() => setShowData(!showData)}>
              (show {showData ? 'activity' : 'underlying data'})
            </A>
            {!isSeparatePage &&
              <Link to={`/preview/${activityTypeId}/${example}`}>
                (Open in separate window) +{' '}
              </Link>}
          </h4>
          <Nav bsStyle="pills" activeKey={example}>
            {examples.map((x, i) =>
              // eslint-disable-next-line react/no-array-index-key
              <NavItem key={i} eventKey={i} onClick={() => setExample(i)}>
                {x.title}
              </NavItem>
            )}
          </Nav>{' '}
          <A
            onClick={() => {
              Collections[`demo-${activityType.id}-${example}`] = uuid();
              setReload(uuid());
            }}
          >
            (Reset data)
          </A>
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
  }
);

const StatefulPreview = compose(
  withState('example', 'setExample', 0),
  withState('showData', 'setShowData', false)
)(StatelessPreview);

StatefulPreview.displayName = 'StatefulPreview';
export default StatefulPreview;
