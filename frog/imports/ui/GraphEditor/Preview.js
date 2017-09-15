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
import { Mosaic, MosaicWindow } from 'react-mosaic-component';
import Draggable from 'react-draggable';

import { activityTypesObj } from '../../activityTypes';
import ReactiveHOC from '../StudentView/ReactiveHOC';

const Icon = ({ onClick, icon }) =>
  <span style={{ marginLeft: '10px' }}>
    <A onClick={onClick}>
      <i className={icon} />
    </A>
  </span>;

const getInitialState = (activities, d = 1) => {
  const n = Math.floor(activities.length / 2);
  return n === 0
    ? activities[0]
    : {
        direction: d > 0 ? 'row' : 'column',
        first: getInitialState(activities.slice(0, n), -d),
        second: getInitialState(activities.slice(n, activities.length), -d)
      };
};

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
    setReload,
    windows = 1,
    setWindows,
    fullWindow,
    setFullWindow
  }: {
    activityTypeId: string,
    example: number,
    setExample: Function,
    showData: boolean,
    setShowData: Function,
    dismiss?: Function,
    config?: Object,
    isSeparatePage: boolean,
    setReload: string => void,
    windows: number,
    setWindows: number => void,
    fullWindow: boolean,
    setFullWindow: boolean => void
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

    const Run = (
      <ActivityToRun
        activityData={activityData}
        userInfo={{
          name: Meteor.user().username,
          id: Meteor.userId()
        }}
        logger={() => {}}
      />
    );

    const Controls = (
      <div className="modal-header">
        <button type="button" className="close" onClick={dismiss}>
          X
        </button>
        <h4 className="modal-title">
          Preview of {activityType.meta.name} ({activityType.id})
          <Icon
            onClick={() => setShowData(!showData)}
            icon={showData ? 'fa fa-address-card-o' : 'fa fa-table'}
          />
          <Icon
            onClick={() => {
              Collections[`demo-${activityType.id}-${example}`] = uuid();
              setReload(uuid());
            }}
            icon="fa fa-refresh"
          />
          {windows > 1 &&
            <Icon
              onClick={() => setWindows(windows - 1)}
              icon="fa fa-minus-square"
            />}
          <Icon onClick={() => setWindows(windows + 1)} icon="fa fa-plus" />
          <Icon onClick={() => setFullWindow(true)} icon="fa fa-arrows-alt" />
          {!isSeparatePage &&
            <Link
              style={{ marginLeft: '10px' }}
              to={`/preview/${activityTypeId}/${example}`}
            >
              <i className="fa fa-share" />
            </Link>}
        </h4>
        <Nav bsStyle="pills" activeKey={example}>
          {examples.map((x, i) =>
            // eslint-disable-next-line react/no-array-index-key
            <NavItem key={i} eventKey={i} onClick={() => setExample(i)}>
              {x.title}
            </NavItem>
          )}
        </Nav>
      </div>
    );

    const Content = (
      <div
        className="modal-body"
        style={{
          position: 'relative',
          width: '100%',
          height: 'calc(100% - 60px)'
        }}
      >
        {windows === 1
          ? Run
          : <Mosaic
              renderTile={x =>
                x !== 'NO'
                  ? <MosaicWindow title={activityType.meta.name}>
                      {Run}
                    </MosaicWindow>
                  : <MosaicWindow title="Empty">
                      <div />
                    </MosaicWindow>}
              initialValue={getInitialState([
                activityType,
                ...Array(windows - 1).fill('NO')
              ])}
            />}
      </div>
    );

    return fullWindow
      ? <div>
          <div
            style={{
              position: 'relative',
              top: '0px',
              left: '0px',
              height: '100vh',
              width: '100vw'
            }}
          >
            {Content}
          </div>
          <Draggable onStart={() => true} defaultPosition={{ x: 200, y: 300 }}>
            <div
              style={{
                zIndex: 99,
                border: '1px solid',
                width: '500px',
                position: 'fixed',
                top: '200px',
                left: '200px',
                background: 'lightgreen'
              }}
            >
              {Controls}
            </div>
          </Draggable>
        </div>
      : <Modal
          contentLabel={'Preview of ' + activityType.id}
          isOpen
          onRequestClose={dismiss}
        >
          {Controls}
          {Content}
        </Modal>;
  }
);

const StatefulPreview = compose(
  withState('example', 'setExample', 0),
  withState('fullWindow', 'setFullWindow', false),
  withState('showData', 'setShowData', false),
  withState('windows', 'setWindows', 1)
)(StatelessPreview);

StatefulPreview.displayName = 'StatefulPreview';
export default StatefulPreview;
