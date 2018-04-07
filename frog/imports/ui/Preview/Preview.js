// @flow

import * as React from 'react';
import ReactTooltip from 'react-tooltip';
import { cloneDeep } from 'lodash';
import { generateReactiveFn } from 'frog-utils';
import Modal from 'react-modal';
import { withState, compose } from 'recompose';
import ShareDB from 'sharedb';
import Draggable from 'react-draggable';

import { withStyles } from 'material-ui/styles';

import { activityTypesObj } from '../../activityTypes';
import { Logs } from './dashboardInPreviewAPI';
import ShowLogs from './ShowLogs';
import Controls from './Controls';
import Content from './Content';
import SocialPanel from './SocialPanel';
import ConfigPanel from './ConfigPanel';

const backend = new ShareDB();
export const connection = backend.connect();

const styles = () => ({
  main: {
    position: 'absolute',
    top: '50px',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: 'calc(100% - 50px)'
  },
  noModal: {
    width: '100%',
    height: 'calc(100% - 50px)'
  },
  fullWindow: {
    position: 'relative',
    top: '0px',
    left: '0px',
    height: '100vh',
    width: '100vw'
  },
  fullWindowControl: {
    zIndex: 99,
    border: '1px solid',
    width: '500px',
    position: 'fixed',
    top: '200px',
    left: '200px',
    background: 'lightgreen'
  },
  drawer: {
    marginTop: '48px',
    width: 250,
    height: 'calc(100% - 48px)'
  },
  button: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: '10'
  },
  text: {
    width: '125px',
    margin: 'auto'
  }
});

export const initActivityDocuments = (
  instances: string[],
  activityType: Object,
  example: number,
  refresh: boolean
) => {
  instances.forEach(instance => {
    const runMergeFunction = _doc => {
      const mergeFunction = activityType.mergeFunction;
      if (
        mergeFunction &&
        example !== undefined &&
        activityType.meta.exampleData &&
        activityType.meta.exampleData[example]
      ) {
        const dataFn = generateReactiveFn(_doc);
        if (activityType.meta.exampleData) {
          mergeFunction(
            cloneDeep(activityType.meta.exampleData[example]),
            dataFn
          );
        }
      }
    };

    const doc = connection.get('rz', 'preview/' + instance);
    doc.fetch();
    if (!doc.type) {
      doc.once('load', () => {
        if (!doc.type) {
          doc.create(cloneDeep(activityType.dataStructure) || {});
          runMergeFunction(doc);
        }
        doc.destroy();
      });
    } else if (refresh) {
      const dataFn = generateReactiveFn(doc);
      dataFn.objInsert(cloneDeep(activityType.dataStructure) || {});
      runMergeFunction(doc);
    }
  });
};

export const StatelessPreview = (props: Object) => {
  const {
    activityTypeId,
    noModal,
    example,
    showLogs,
    fullWindow,
    showDashExample,
    classes,
    instances
  } = props;
  const activityType = activityTypesObj[activityTypeId];
  if (!activityType) {
    return (
      <div className={classes.main}>
        <ConfigPanel {...props} />
      </div>
    );
  }

  initActivityDocuments(instances, activityType, example, false);

  const FullWindowLayout = (
    <div>
      <div className={classes.fullWindow}>
        {showLogs && !showDashExample ? (
          <ShowLogs logs={Logs} />
        ) : (
          <Content {...props} />
        )}
      </div>
      <Draggable onStart={() => true} defaultPosition={{ x: 200, y: 300 }}>
        <div className={classes.fullWindowControl}>
          <Controls {...props} />
        </div>
      </Draggable>
      <ReactTooltip delayShow={1000} />
    </div>
  );

  const NoModalLayout = (
    <div className={classes.noModal}>
      <Controls {...props} />
      {showLogs && !showDashExample ? (
        <ShowLogs logs={Logs} />
      ) : (
        <Content {...props} />
      )}
      <ReactTooltip delayShow={1000} />
    </div>
  );

  const Layout = fullWindow ? (
    FullWindowLayout
  ) : noModal ? (
    NoModalLayout
  ) : (
    <Modal
      ariaHideApp={false}
      contentLabel={'Preview of ' + activityType.id}
      isOpen
      onRequestClose={() => {}}
    >
      <Controls {...props} />
      {showLogs && !showDashExample ? (
        <ShowLogs logs={Logs} />
      ) : (
        <Content {...props} />
      )}
      <ReactTooltip delayShow={1000} />
    </Modal>
  );

  return (
    <div className={classes.main}>
      <ConfigPanel {...props} />
      {Layout}
      <SocialPanel {...props} />
    </div>
  );
};

const StyledPreview = withStyles(styles)(StatelessPreview);

const StatefulPreview = compose(
  withState('example', 'setExample', -1),
  withState('fullWindow', 'setFullWindow', false),
  withState('showData', 'setShowData', false),
  withState('showDash', 'setShowDash', false),
  withState('showDashExample', 'setShowDashExample', false),
  withState('windows', 'setWindows', 1),
  withState('showLogs', 'setShowLogs', false),
  withState('users', 'setUsers', ['Chen Li']),
  withState('instances', 'setInstances', ['Chen Li']),
  withState('plane', 'setPlane', 1),
  withState('config', 'setConfig', {}),
  withState('activityTypeId', 'setActivityTypeId', undefined),
  withState('reloadAPIform', 'setReloadAPIform', undefined)
)(StyledPreview);

StatefulPreview.displayName = 'StatefulPreview';
export default StatefulPreview;
