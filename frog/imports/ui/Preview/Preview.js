// @flow

import * as React from 'react';
import ReactTooltip from 'react-tooltip';
import { cloneDeep, uniqBy, range } from 'lodash';
import Stringify from 'json-stable-stringify';
import { generateReactiveFn, uuid, getInitialState } from 'frog-utils';
import Modal from 'react-modal';
import { Nav, NavItem } from 'react-bootstrap';
import { withState, compose } from 'recompose';
import { Link } from 'react-router-dom';
import ShareDB from 'sharedb';
import { Mosaic, MosaicWindow } from 'react-mosaic-component';
import Draggable from 'react-draggable';

import { activityTypesObj } from '../../activityTypes';
import ReactiveHOC from '../StudentView/ReactiveHOC';
import ShowInfo from './ShowInfo';
import {
  createLogger,
  Logs,
  initDocuments,
  DashPreviewWrapper,
  hasDashExample
} from './dashboardInPreviewAPI';
import ShowLogs from './ShowLogs';
import ShowDashExample from './ShowDashExample';
import Icon from './Icon';

const backend = new ShareDB();
export const connection = backend.connect();
const Collections = {};

export const StatelessPreview = withState('reload', 'setReload', '')(
  ({
    activityTypeId,
    noModal,
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
    reload,
    showDashExample,
    setShowDashExample,
    externalReload = '',
    allExamples,
    onExample
  }: {
    activityTypeId: string,
    example: number,
    setExample: Function,
    showData: boolean,
    setShowDash: Function,
    showDash: boolean,
    setShowDashExample: Function,
    showDashExample: boolean,
    setShowData: Function,
    setShowLogs: Function,
    showLogs: boolean,
    dismiss?: Function,
    config?: Object,
    isSeparatePage: boolean,
    setReload: string => void,
    externalReload: string,
    windows: number,
    setWindows: number => void,
    fullWindow: boolean,
    setFullWindow: boolean => void,
    reload: string,
    noModal?: boolean,
    allExamples?: boolean,
    onExample?: Function
  }) => {
    const activityType = activityTypesObj[activityTypeId];
    const RunComp = activityType.ActivityRunner;
    RunComp.displayName = activityType.id;

    const examples =
      (config && !allExamples
        ? uniqBy(activityType.meta.exampleData, x => Stringify(x.data))
        : activityType.meta.exampleData) || {};

    const activityData = examples[example] ? cloneDeep(examples[example]) : {};
    if (config) {
      activityData.config = config;
    }

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
            if (
              mergeFunction &&
              example &&
              activityType.meta.exampleData &&
              activityType.meta.exampleData[example]
            ) {
              const dataFn = generateReactiveFn(doc);
              if (activityType.meta.exampleData) {
                mergeFunction(
                  cloneDeep(activityType.meta.exampleData[example]),
                  dataFn
                );
              }
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
          activityType={activityType.id}
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
            activityData.config
          )}
          groupingValue={'' + Math.ceil(id / 2)}
        />
      );
    };

    const ex = showDashExample ? activityType.dashboard.exampleLogs : examples;
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
          {hasDashExample(activityType) && (
              <Icon
                onClick={() => setShowDashExample(!showDashExample)}
                icon="fa fa-line-chart"
                color={showDashExample ? '#3d76b8' : '#b3cae6'}
                tooltip="Toggle example logs dashboard"
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

              const dashrefresh = `demo-${
                activityType.id
              }-${example}-DASHBOARD`;
              Collections[dashrefresh] = uuid();

              Logs.length = 0;
              setReload(uuid());
              // resets the reactive documents for the dashboard
              initDocuments(activityType, true);
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
          {ex &&
            ex.map((x, i) => (
              <NavItem
                key={x.title}
                className="examples"
                eventKey={i}
                onClick={() => {
                  if (onExample) {
                    onExample(i);
                  } else {
                    setExample(i);
                  }
                }}
              >
                {x.title}
              </NavItem>
            ))}
        </Nav>
      </div>
    );
    const users = showDashExample
      ? ['dashboard']
      : [
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
        {showDashExample ? (
          <ShowDashExample
            example={example}
            activityType={activityType}
            showLogs={showLogs}
          />
        ) : users.length === 1 || showData ? (
          <Run name={users[0]} id={1} />
        ) : (
          <Mosaic
            renderTile={([x, id], path) =>
              x === 'dashboard' && activityType.dashboard ? (
                <MosaicWindow
                  title={'dashboard - ' + activityType.meta.name}
                  path={path}
                >
                  <DashPreviewWrapper
                    config={activityData.config}
                    instances={users
                      .filter((_, i) => i % 2 !== 0)
                      .map((_, i) => i + 1)}
                    users={users
                      .filter(e => e !== 'dashboard')
                      .reduce(
                        (acc, name, i) => ({ ...acc, [i + 1]: name }),
                        {}
                      )}
                    activityType={activityType}
                  />
                </MosaicWindow>
              ) : (
                <MosaicWindow
                  path={path}
                  reload={reload + externalReload}
                  example={example}
                  title={
                    x + '/' + Math.ceil(id / 2) + ' - ' + activityType.meta.name
                  }
                >
                  <Run name={x} id={id} />
                </MosaicWindow>
              )
            }
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
          {showLogs && !showDashExample ? <ShowLogs logs={Logs} /> : Content}
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
    ) : noModal ? (
      <React.Fragment>
        {Controls}
        {showLogs && !showDashExample ? <ShowLogs logs={Logs} /> : Content}
        <ReactTooltip delayShow={1000} />
      </React.Fragment>
    ) : (
      <Modal
        ariaHideApp={false}
        contentLabel={'Preview of ' + activityType.id}
        isOpen
        onRequestClose={dismiss}
      >
        {Controls}
        {showLogs && !showDashExample ? <ShowLogs logs={Logs} /> : Content}
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
  withState('showDashExample', 'setShowDashExample', false),
  withState('windows', 'setWindows', 1),
  withState('showLogs', 'setShowLogs', false)
)(StatelessPreview);

StatefulPreview.displayName = 'StatefulPreview';
export default StatefulPreview;
