// @flow
import React from 'react';
import ReactTooltip from 'react-tooltip';
import { cloneDeep, uniqBy, range } from 'lodash';
import Stringify from 'json-stable-stringify';
import { type LogDBT, A, generateReactiveFn, uuid } from 'frog-utils';
import Modal from 'react-modal';
import { Nav, NavItem } from 'react-bootstrap';
import { withState, compose } from 'recompose';
import { Link } from 'react-router-dom';
import ShareDB from 'sharedb';
import { Mosaic, MosaicWindow } from 'react-mosaic-component';
import Draggable from 'react-draggable';

import { activityTypesObj } from '../../activityTypes';
import ReactiveHOC from '../StudentView/ReactiveHOC';
import { DashboardComp } from '../TeacherView/Dashboard';
import ShowInfo from './ShowInfo';
import createLogger, { Logs } from './createLogger';
import ShowLogs from './ShowLogs';

const Icon = ({
  onClick,
  icon,
  color,
  tooltip
}: {
  onClick: Function,
  icon: string,
  color?: string,
  tooltip?: string
}) => (
  <span style={{ marginLeft: '10px' }}>
    <A onClick={onClick}>
      <i className={icon} style={{ color }} data-tip={tooltip} />
    </A>
  </span>
);

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
    showDash,
    setShowDash,
    dismiss,
    config,
    isSeparatePage = false,
    setReload,
    windows = 1,
    showLogs,
    setShowLogs,
    setWindows,
    fullWindow,
    setFullWindow,
    reload
  }: {
    activityTypeId: string,
    example: number,
    setExample: Function,
    showData: boolean,
    setShowDash: Function,
    showDash: boolean,
    setShowData: Function,
    setShowLogs: Function,
    showLogs: boolean,
    dismiss?: Function,
    config?: Object,
    isSeparatePage: boolean,
    setReload: string => void,
    windows: number,
    setWindows: number => void,
    fullWindow: boolean,
    setFullWindow: boolean => void,
    reload: string
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

    const dashcoll = `demo-${activityType.id}-${example}-DASHBOARD`;
    if (!Collections[dashcoll]) {
      Collections[dashcoll] = uuid();
    }

    const dashboard = connection.get('rz', Collections[dashcoll]);
    dashboard.fetch();
    if (!dashboard.type) {
      dashboard.once('load', () => {
        console.log('dash load');
        if (!dashboard.type) {
          console.log('dash create');
          dashboard.create(
            (activityType.dashboard && activityType.dashboard.initData) || {}
          );
        }
      });
    }
    console.log(dashboard.id, dashboard.data);

    const reactiveDash = generateReactiveFn(dashboard);

    const mergeData = (log: LogDBT) => {
      if (activityType.dashboard && activityType.dashboard.mergeLog) {
        activityType.dashboard.mergeLog(
          cloneDeep(dashboard.data),
          reactiveDash,
          log
        );
      }
    };

    range(0, Math.ceil(windows / 2)).forEach(i => {
      const coll = `demo-${activityType.id}-${example}-${i + 1}`;
      if (!Collections[coll]) {
        Collections[coll] = uuid();
      }

      const doc = connection.get('rz', Collections[coll]);
      doc.fetch();
      if (!doc.type) {
        doc.once('load', () => {
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
          doc.destroy();
        });
      }
    });

    const Run = ({ name, id }) => {
      const ActivityToRun = ReactiveHOC(
        Collections[`demo-${activityType.id}-${example}-${Math.ceil(id / 2)}`],
        connection
      )(showData ? ShowInfo : RunComp);
      return (
        <ActivityToRun
          activityData={activityData}
          userInfo={{
            name,
            id
          }}
          stream={() => undefined}
          logger={createLogger(
            'preview',
            '' + Math.ceil(id / 2),
            activityType.id,
            'preview',
            '' + id,
            2,
            mergeData
          )}
          groupingValue={'' + Math.ceil(id / 2)}
        />
      );
    };

    const Controls = (
      <div className="modal-header">
        <button
          type="button"
          className="close"
          onClick={dismiss}
          data-tip="Close, and show list of activity types to preview"
        >
          X
        </button>
        <h4 className="modal-title">
          Preview of {activityType.meta.name} ({activityType.id})
          <Icon
            onClick={() => setShowData(!showData)}
            icon={showData ? 'fa fa-address-card-o' : 'fa fa-table'}
            tooltip={showData ? 'Show component' : 'Show underlying data'}
          />
          {activityType.dashboard && (
            <Icon
              onClick={() => setShowDash(!showDash)}
              icon="fa fa-tachometer"
              color={showDash ? '#3d76b8' : '#b3cae6'}
              tooltip="Toggle dashboard"
            />
          )}
          <Icon
            onClick={() => setShowLogs(!showLogs)}
            icon="fa fa-list"
            color={showLogs ? '#3d76b8' : '#b3cae6'}
            tooltip="Toggle log table"
          />
          <Icon
            onClick={() => {
              range(0, Math.ceil(windows / 2)).forEach(i => {
                const coll = `demo-${activityType.id}-${example}-${i + 1}`;
                Collections[coll] = uuid();
              });

              const dashcoll = `demo-${activityType.id}-${example}-DASHBOARD`;
              Collections[dashcoll] = uuid();

              Logs.length = 0;
              setReload(uuid());
            }}
            icon="fa fa-refresh"
            tooltip="Reset reactive data"
          />
          <Icon
            onClick={() => windows > 1 && setWindows(windows - 1)}
            icon="fa fa-minus-square"
            tooltip="Remove one user"
          />
          <Icon
            onClick={() => setWindows(windows + 1)}
            icon="fa fa-plus"
            tooltip="Add a user"
          />
          <Icon
            onClick={() => setFullWindow(!fullWindow)}
            icon="fa fa-arrows-alt"
            tooltip="Toggle full window"
          />
          {!isSeparatePage && (
            <Link
              style={{ marginLeft: '10px' }}
              to={`/preview/${activityTypeId}/${example}`}
            >
              <i className="fa fa-share" data-tip="Open in permanent URL" />
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
    );
    const users = [
      ...[
        'Chen Li',
        'Maurice',
        'Edgar',
        'Noel',
        'Patrick',
        'Ole',
        'Niels'
      ].slice(0, windows),
      ...((showDash && ['dashboard']) || [])
    ];

    const Content = (
      <div
        className="modal-body"
        style={{
          position: 'relative',
          width: '100%',
          height: 'calc(100% - 60px)'
        }}
      >
        {users.length === 1 || showData ? (
          <Run name={users[0]} id={1} />
        ) : (
          <Mosaic
            renderTile={([x, id], path) =>
              x === 'dashboard' && activityType.dashboard ? (
                <MosaicWindow
                  title={'dashboard - ' + activityType.meta.name}
                  path={path}
                >
                  <DashboardComp
                    example={example}
                    activity={{ activityType: activityType.id }}
                    config={activityData.config}
                    reload={reload}
                    doc={dashboard}
                    users={users
                      .filter(e => e !== 'dashboard')
                      .map((e, i) => ({ _id: i, username: e }))}
                  />
                </MosaicWindow>
              ) : (
                <MosaicWindow
                  path={path}
                  reload={reload}
                  example={example}
                  title={
                    x + '/' + Math.ceil(id / 2) + ' - ' + activityType.meta.name
                  }
                >
                  <Run name={x} id={id} />
                </MosaicWindow>
              )}
            initialValue={getInitialState(users.map((x, i) => [x, i + 1]))}
          />
        )}
      </div>
    );

    return fullWindow ? (
      <div>
        <div
          style={{
            position: 'relative',
            top: '0px',
            left: '0px',
            height: '100vh',
            width: '100vw'
          }}
        >
          {showLogs ? <ShowLogs logs={Logs} /> : Content}
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
        <ReactTooltip delayShow={1000} />
      </div>
    ) : (
      <Modal
        contentLabel={'Preview of ' + activityType.id}
        isOpen
        onRequestClose={dismiss}
      >
        {Controls}
        {showLogs ? <ShowLogs logs={Logs} /> : Content}
        <ReactTooltip delayShow={1000} />
      </Modal>
    );
  }
);

const StatefulPreview = compose(
  withState('example', 'setExample', 0),
  withState('fullWindow', 'setFullWindow', false),
  withState('showData', 'setShowData', false),
  withState('showDash', 'setShowDash', false),
  withState('windows', 'setWindows', 1)
)(StatelessPreview);

StatefulPreview.displayName = 'StatefulPreview';
export default StatefulPreview;
