// @flow

import * as React from 'react';
import ReactTooltip from 'react-tooltip';
import { cloneDeep, uniqBy } from 'lodash';
import Stringify from 'json-stable-stringify';
import { generateReactiveFn, uuid } from 'frog-utils';
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
export const Collections = {};

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
  }
});

export const initActivityDocuments = (instances, activityType, example, refresh) => {
  instances.forEach(instance => {
    if (!Collections[instance] || refresh) {
      Collections[instance] = uuid();
    }

    const doc = connection.get('rz', Collections[instance]);
    doc.fetch();
    if (!doc.type) {
      doc.once('load', () => {
        if (!doc.type) {
          doc.create(cloneDeep(activityType.dataStructure) || {});
          const mergeFunction = activityType.mergeFunction;
          if (
            mergeFunction &&
            example !== undefined &&
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
};

export const StatelessPreview = (props: Object) => {
  const {
    activityTypeId,
    noModal,
    example,
    config,
    showLogs,
    fullWindow,
    showDashExample,
    allExamples,
    classes,
    instances,
    setInstances,
    setUsers,
    setPlane,
  } = props;
  const activityType = activityTypesObj[activityTypeId];
  if (!activityType) {
    return <ConfigPanel {...props} />;
  }
  const examples =
    (config && !allExamples
      ? uniqBy(activityType.meta.exampleData, x => Stringify(x.data))
      : activityType.meta.exampleData) || {};

  initActivityDocuments(instances, activityType, example, false);

  const FullWindowLayout = (
    <div>
      <div className={classes.fullWindow}>
        {showLogs && !showDashExample ? (
          <ShowLogs logs={Logs} />
        ) : (
          <Content activityType={activityType} examples={examples} {...props} />
        )}
      </div>
      <Draggable onStart={() => true} defaultPosition={{ x: 200, y: 300 }}>
        <div className={classes.fullWindowControl}>
          <Controls
            activityType={activityType}
            examples={examples}
            {...props}
          />
        </div>
      </Draggable>
      <ReactTooltip delayShow={1000} />
    </div>
  );

  const NoModalLayout = (
    <div className={classes.noModal}>
      <Controls activityType={activityType} examples={examples} {...props} />
      {showLogs && !showDashExample ? (
        <ShowLogs logs={Logs} />
      ) : (
        <Content activityType={activityType} examples={examples} {...props} />
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
      <Controls activityType={activityType} examples={examples} {...props} />
      {showLogs && !showDashExample ? (
        <ShowLogs logs={Logs} />
      ) : (
        <Content activityType={activityType} examples={examples} {...props} />
      )}
      <ReactTooltip delayShow={1000} />
    </Modal>
  );

  return (
    <div className={classes.main} >
      <ConfigPanel {...props} />
      {Layout}
      <SocialPanel {...{ setInstances, setUsers, setPlane }} />
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
