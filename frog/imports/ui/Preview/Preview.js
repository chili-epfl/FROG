// @flow

import * as React from 'react';
import ReactTooltip from 'react-tooltip';
import Modal from 'react-modal';
import ShareDB from 'sharedb';
import Draggable from 'react-draggable';

import { withStyles } from 'material-ui/styles';
import Dialog from 'material-ui/Dialog';

import { activityTypesObj } from '../../activityTypes';
import { Logs } from './dashboardInPreviewAPI';
import ShowLogs from './ShowLogs';
import Controls from './Controls';
import Content from './Content';
import ConfigPanel from './ConfigPanel';

const styles = {
  main: {
    display: 'flex',
    marginTop: '48px',
    height: 'calc(100vh - 48px)'
  },
  noModal: {
    flex: '0 0 auto',
    paddingLeft: '10px',
    width: '70%'
  },
  noModalPreviewContent: {
    overflow: 'auto',
    height: 'calc(100% - 100px)'
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
};

export const backend = new ShareDB();
export const connection = backend.connect();
window.connection = connection;

const StatelessPreview = (props: Object) => {
  const {
    activityTypeId,
    modal,
    dismiss,
    showLogs,
    fullWindow,
    showDashExample,
    classes
  } = props;

  const activityType = activityTypesObj[activityTypeId];
  if (!activityType) {
    return (
      <div className={classes.main}>
        <ConfigPanel {...props} />
      </div>
    );
  }

  const PreviewContent =
    showLogs && !showDashExample ? (
      <ShowLogs logs={Logs} />
    ) : (
      <Content {...props} />
    );

  const FullWindowP = (
    <Dialog open={fullWindow} fullScreen>
      {PreviewContent}
      <Draggable onStart={() => true} defaultPosition={{ x: 200, y: 300 }}>
        <div className={classes.fullWindowControl}>
          <Controls {...props} />
        </div>
      </Draggable>
      <ReactTooltip delayShow={1000} place="right" />
    </Dialog>
  );

  const NoModalP = (
    <div className={classes.main}>
      <ConfigPanel {...props} />
      <div className={classes.noModal}>
        <Controls {...props} />
        <div className={classes.noModalPreviewContent}>{PreviewContent}</div>
        <ReactTooltip delayShow={1000} place="right" />
      </div>
    </div>
  );

  const ModalP = (
    <Modal
      ariaHideApp={false}
      contentLabel={'Preview of ' + activityTypeId}
      isOpen
      onRequestClose={dismiss}
    >
      <Controls {...props} />
      {PreviewContent}
      <ReactTooltip delayShow={1000} place="right" />
    </Modal>
  );

  return fullWindow ? FullWindowP : modal ? ModalP : NoModalP;
};

const StyledPreview = withStyles(styles)(StatelessPreview);

export default StyledPreview;
