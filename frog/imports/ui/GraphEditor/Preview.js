// @flow

import React from 'react';
import { cloneDeep, uniqBy, range } from 'lodash';
import Stringify from 'json-stable-stringify';
import { A, generateReactiveFn, uuid } from 'frog-utils';
import Modal from 'react-modal';
import { Nav, NavItem } from 'react-bootstrap';
import { withState, compose } from 'recompose';
import { Inspector } from 'react-inspector';
import { Link } from 'react-router-dom';
import ShareDB from 'sharedb';
import { Mosaic, MosaicWindow } from 'react-mosaic-component';
import Draggable from 'react-draggable';

import { activityTypesObj } from '../../activityTypes';
import ReactiveHOC from '../StudentView/ReactiveHOC';
import { DashboardComp } from '../TeacherView/Dashboard';

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

    const dashboard = connection.get(
      'rz',
      `demo-${activityType.id}-${example}-DASHBOARD`
    );
    dashboard.fetch();
    dashboard.on('load', () => {
      if (!dashboard.type) {
        dashboard.create(
          (activityType.dashboard && activityType.dashboard.initData) || {}
        );
      }
    });

    const reactiveDash = generateReactiveFn(dashboard);

    const logger = (id, instanceId) => payload => {
      if (activityType.dashboard && activityType.dashboard.mergeLog) {
        activityType.dashboard.mergeLog(
          cloneDeep(dashboard.data),
          reactiveDash,
          { userId: id, payload, updatedAt: Date(), instanceId }
        );
      }
    };

    range(0, Math.ceil(windows + 1 / 2)).forEach(i => {
      const coll = `demo-${activityType.id}-${example}-${i}`;
      if (!Collections[coll]) {
        Collections[coll] = uuid();
      }

      const doc = connection.get('rz', Collections[coll]);
      doc.subscribe();
      doc.on('load', () => {
        if (!doc.type) {
          doc.create(cloneDeep(activityType.dataStructure) || {});
          const mergeFunction = activityType.mergeFunction;
          if (mergeFunction && activityType.meta.exampleData[example]) {
            const dataFn = generateReactiveFn(doc);
            mergeFunction(
              cloneDeep(activityType.meta.exampleData[example]),
              dataFn
            );
          }
        }
      });
    });

    const Run = ({ name, id }) => {
      const doc = connection.get(
        'rz',
        Collections[`demo-${activityType.id}-${example}-${Math.ceil(id / 2)}`]
      );
      doc.subscribe();
      const ActivityToRun = ReactiveHOC(
        'demo/' + activityType.id + '/' + example,
        doc
      )(showData ? ShowInfo : RunComp);
      return (
        <ActivityToRun
          activityData={activityData}
          userInfo={{
            name,
            id
          }}
          logger={logger(id, Math.ceil(id / 2))}
          groupingValue={'' + Math.ceil(id / 2)}
        />
      );
    };

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
          <Icon
            onClick={() => windows > 1 && setWindows(windows - 1)}
            icon="fa fa-minus-square"
          />
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
          ? <Run name="Chen Li" id={1} />
          : <Mosaic
              renderTile={([x, id]) =>
                x === 'dashboard' && activityType.dashboard
                  ? <MosaicWindow
                      title={'dashboard - ' + activityType.meta.name}
                    >
                      <DashboardComp
                        activity={{ activityType: activityType.id }}
                        config={activityData.config}
                        doc={dashboard}
                        users={[
                          'Chen Li',
                          'Maurice',
                          'dashboard',
                          'Edgar',
                          'Noel'
                        ].map((e, i) => ({ _id: i + 1, username: e }))}
                      />
                    </MosaicWindow>
                  : <MosaicWindow
                      title={
                        x +
                        '/' +
                        Math.ceil(id / 2) +
                        ' - ' +
                        activityType.meta.name
                      }
                    >
                      <Run name={x} id={id} />
                    </MosaicWindow>}
              initialValue={getInitialState(
                ['Chen Li', 'Maurice', 'dashboard', 'Edgar', 'Noel']
                  .map((x, i) => [x, i + 1])
                  .slice(0, windows)
              )}
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
