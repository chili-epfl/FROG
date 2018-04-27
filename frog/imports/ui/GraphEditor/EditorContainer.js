import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import ReactTooltip from 'react-tooltip';
import Grid from 'material-ui/Grid';
import { removeActivity } from '/imports/api/remoteActivities';
import { removeGraph } from '/imports/api/remoteGraphs';

import { connect } from './store';
import Graph from './Graph';
import { RenameBox } from './Rename';
import SidePanel from './SidePanel';
import HelpModal from './HelpModal';
import ModalExport from './RemoteControllers/ModalExport';
import ModalImport from './RemoteControllers/ModalImport';
import ModalDelete from './RemoteControllers/ModalDelete';

import TopPanel from './TopPanel';
import { ModalPreview } from '../Preview';
import TopBar from '../App/TopBar';

const styles = () => ({
  root: {
    marginTop: '48px',
    height: '100%'
  },
  sheet: {
    background: 'white'
  }
});

const EditorPanel = () => (
  <div className="bootstrap" style={styles.sheet}>
    <div style={{ height: 'calc(100vh - 64px - 48px - 150px)' }}>
      <ReactTooltip delayShow={500} />
      <Graph scaled hasTimescale isEditable />
    </div>
    <RenameBox />
    <div
      className="bootstrap"
      style={{ margin: 2, height: 150, border: '1px solid black' }}
    >
      <Graph hasPanMap />
    </div>
  </div>
);

type StateT = {
  exportOpen: Boolean,
  importOpen: Boolean,
  deleteOpen: Boolean,
  locallyChanged: Boolean,
  idRemove: string
};

class Editor extends Component<Object, StateT> {
  constructor(props) {
    super(props);
    this.state = {
      exportOpen: false,
      importOpen: false,
      deleteOpen: false,
      locallyChanged: false,
      idRemove: ''
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.props.store.ui.updateWindow);
    this.props.store.ui.updateWindow();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.props.store.ui.updateWindow);
  }

  render() {
    const { classes } = this.props;
    if (this.props.store.ui.showPreview) {
      return (
        <ModalPreview
          activityTypeId={this.props.store.ui.showPreview.activityTypeId}
          _config={this.props.store.ui.showPreview.config}
          dismiss={() => this.props.store.ui.setShowPreview(false)}
        />
      );
    }
    const setDelete = val => this.setState({ deleteOpen: val });
    const setIdRemove = val => this.setState({ idRemove: val });

    return (
      <div className={classes.root}>
        <TopBar />
        <Grid container>
          <Grid item xs={12}>
            <TopPanel
              openExport={() => this.setState({ exportOpen: true })}
              openImport={() => this.setState({ importOpen: true })}
            />
            <ModalExport
              exportType="graph"
              modalOpen={this.state.exportOpen}
              setModal={val => this.setState({ exportOpen: val })}
              graphId={this.props.store.graphId}
              graphName={this.props.store}
              madeChanges={() => this.setState({ locallyChanged: true })}
            />
            <ModalImport
              modalOpen={this.state.importOpen}
              setModal={val => this.setState({ importOpen: val })}
              locallyChanged={this.state.locallyChanged}
              changesLoaded={() => this.setState({ locallyChanged: true })}
              {...{
                setDelete,
                setIdRemove
              }}
            />
            <ModalDelete
              modalOpen={this.state.deleteOpen}
              setModal={setDelete}
              remove={() => {
                if (this.state.importOpen)
                  removeGraph(this.state.idRemove, () => this.forceUpdate());
                else
                  removeActivity(this.state.idRemove, () => this.forceUpdate());
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container id="graph-editor">
              <Grid item xs>
                <EditorPanel />
              </Grid>
              <SidePanel
                madeChanges={() => this.setState({ locallyChanged: true })}
                locallyChanged={this.state.locallyChanged}
                changesLoaded={() => this.setState({ locallyChanged: true })}
                {...{
                  setDelete,
                  setIdRemove
                }}
              />
            </Grid>
          </Grid>
        </Grid>
        <HelpModal
          show={this.props.store.ui.showModal}
          hide={() => this.props.store.ui.setModal(false)}
        />
      </div>
    );
  }
}

export default withStyles(styles)(connect(Editor));
