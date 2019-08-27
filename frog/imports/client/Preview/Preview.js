// @flow
//

import * as React from 'react';
import ReactTooltip from 'react-tooltip';
import ShareDB from '@teamwork/sharedb';
import Draggable from 'react-draggable';

import { withStyles } from '@material-ui/styles';
import Dialog from '@material-ui/core/Dialog';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';

import { activityTypesObj } from '/imports/activityTypes';
import { Logs } from './dashboardInPreviewAPI';
import ShowLogs from './ShowLogs';
import Controls from './Controls';
import Content from './Content';
import ConfigPanel from './ConfigPanel';

// eslint-disable-next-line import/no-mutable-exports
export let backend = new ShareDB({
  disableDocAction: true,
  disableSpaceDelimitedActions: true
});
export let connection = backend.connect(); // eslint-disable-line import/no-mutable-exports

export const restartBackend = () => {
  backend = new ShareDB({
    disableDocAction: true,
    disableSpaceDelimitedActions: true
  });
  connection = backend.connect();
};

const styles = {
  main: {
    display: 'flex',
    height: 'calc(100vh - 48px)'
  },
  noModal: {
    flex: '1 0 0px',
    padding: '8px',
    display: 'flex',
    flexDirection: 'column'
  },
  noModalPreviewContent: {
    overflow: 'auto',
    flex: '1 0 0px',
    padding: '4px',
    margin: '4px'
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
  },
  configPanelMain: {
    flex: '0 0 350px',
    overflow: 'hidden',
    background: '#fff0'
  },
  configPanelMetadataContainer: {
    backgroundColor: '#dbdbdb',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: '10px'
  }
};

const StatelessPreview = (props: Object) => {
  const {
    delay,
    activityTypeId,
    graphEditor,
    showLogs,
    fullWindow,
    showDashExample,
    classes
  } = props;
  const activityType = activityTypesObj[activityTypeId];
  if (!activityType) {
    return (
      <div className={classes.main}>
        <ConfigPanel {...props} classes={undefined} />
      </div>
    );
  }

  const PreviewContent = delay ? (
    <CircularProgress />
  ) : showLogs && !showDashExample ? (
    <ShowLogs logs={Logs} />
  ) : (
    <Content {...props} classes={undefined} />
  );

  const FullWindowP = (
    <Dialog open={fullWindow} fullScreen>
      {PreviewContent}
      <Draggable onStart={() => true} defaultPosition={{ x: 200, y: 300 }}>
        <div className={classes.fullWindowControl}>
          <Controls {...props} classes={undefined} />
        </div>
      </Draggable>
      <ReactTooltip delayShow={300} place="right" />
    </Dialog>
  );

  const NoModalP = (
    <div className={classes.main}>
      <ConfigPanel {...props} classes={undefined} />
      <div className={classes.noModal}>
        <Controls {...props} classes={undefined} />
        <Paper className={classes.noModalPreviewContent}>
          {PreviewContent}
        </Paper>
        <ReactTooltip delayShow={300} place="right" />
      </div>
    </div>
  );

  const GraphEditorP = (
    <div style={{ width: '100%' }}>
      <Controls {...props} classes={undefined} />
      {/* Subtracting Controls Height */}
      <div style={{ height: 'calc(100% - 44px)' }}>{PreviewContent}</div>
      <ReactTooltip delayShow={300} place="right" />
    </div>
  );

  return fullWindow ? FullWindowP : graphEditor ? GraphEditorP : NoModalP;
};

export default withStyles(styles)(StatelessPreview);
