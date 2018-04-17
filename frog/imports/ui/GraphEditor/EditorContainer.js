import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import ReactTooltip from 'react-tooltip';

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

import { removeActivity, collectActivities } from '../../api/remoteActivities';
import { removeGraph, collectGraphs } from '../../api/remoteGraphs';

const styles = () => ({
  root: {
    paddingTop: 48,
    paddingRight: 3,
    paddingLeft: 3
  },
  gridContent: {
    marginLeft: 0,
    display: 'flex',
    flexDirection: 'column'
  },

  main: {
    height: 760,
    flex: 30,
    overflow: 'hidden'
  },
  container: {
    height: '95%',
    display: 'flex',
    flexDirection: 'row'
  },
  sheet: {
    background: 'white'
  }
});
const EditorPanel = () => (
  <div className="bootstrap" style={styles.sheet}>
    <div style={{ height: 600, border: '1px solid black' }}>
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
    <HelpModal />
  </div>
);

type StateT = {
  lastRefreshAct: Date,
  lastRefreshGraph: Date,
  exportOpen: Boolean,
  importOpen: Boolean,
  deleteOpen: Boolean,
  importActivityList: Array<any>,
  importGraphList: Array<any>,
  locallyChanged: Boolean,
  idRemove: string
};

class Editor extends Component<Object, StateT> {
  constructor(props) {
    super(props);
    this.state = {
      lastRefreshAct: new Date().getTime(),
      lastRefreshGraph: new Date().getTime(),
      exportOpen: false,
      importOpen: false,
      deleteOpen: false,
      importActivityList: [],
      importGraphList: [],
      locallyChanged: false,
      idRemove: ''
    };
    collectActivities().then(e => {
      this.state.importActivityList = e;
      this.state.lastRefreshAct = new Date().getTime();
    });
    collectGraphs().then(e => {
      this.state.importGraphList = e;
      this.state.lastRefreshGraph = new Date().getTime();
    });
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
    const setImportActivityList = (val, fun?) =>
      this.setState({ importActivityList: val }, fun);
    const setImportGraphList = (val, fun?) =>
      this.setState({ importGraphList: val }, fun);
    const refreshActDate = () =>
      this.setState({ lastRefreshAct: new Date().getTime() });
    const refreshGraphDate = () =>
      this.setState({ lastRefreshGraph: new Date().getTime() });

    return (
      <div className={classes.root}>
        <TopBar barHeight={classes.root.paddingTop} />
        <div className={classes.gridContent}>
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
            lastRefreshGraph={this.state.lastRefreshGraph}
            importGraphList={this.state.importGraphList}
            locallyChanged={this.state.locallyChanged}
            changesLoaded={() => this.setState({ locallyChanged: true })}
            {...{
              setImportGraphList,
              setDelete,
              setIdRemove,
              refreshGraphDate
            }}
          />
          <ModalDelete
            modalOpen={this.state.deleteOpen}
            setModal={setDelete}
            remove={() => {
              const promise = this.state.importOpen
                ? removeGraph(this.state.idRemove)
                : removeActivity(this.state.idRemove);
              promise.then(() => {
                if (this.state.importOpen)
                  setImportGraphList(
                    this.state.importGraphList.filter(
                      x => x.uuid !== this.state.idRemove
                    )
                  );
                else
                  setImportActivityList(
                    this.state.importActivityList.filter(
                      x => x.uuid !== this.state.idRemove
                    )
                  );
              });
            }}
          />
          <div className={classes.container}>
            <div className={classes.main}>
              <EditorPanel />
            </div>
            <SidePanel
              importActivityList={this.state.importActivityList}
              lastRefreshAct={this.state.lastRefreshAct}
              madeChanges={() => this.setState({ locallyChanged: true })}
              locallyChanged={this.state.locallyChanged}
              changesLoaded={() => this.setState({ locallyChanged: true })}
              {...{
                refreshActDate,
                setImportActivityList,
                setDelete,
                setIdRemove
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(connect(Editor));
