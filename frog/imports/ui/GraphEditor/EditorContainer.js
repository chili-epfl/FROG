import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';

import { connect } from './store';
import Graph from './Graph';
import { RenameBox } from './Rename';
import SidePanel from './SidePanel';
import HelpModal from './HelpModal';
import ModalExport from './RemoteControllers/ModalExport';
import ModalImport from './RemoteControllers/ModalImport';
import ModalDelete from './RemoteControllers/ModalDelete';

import TopPanel from './TopPanel';
import Preview from '../Preview/Preview';
import TopBar from '../App/TopBar';

import { removeActivity } from '../../api/remoteActivities';
import { removeGraph } from '../../api/remoteGraphs';

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
  exportOpen: Boolean,
  importOpen: Boolean,
  deleteOpen: Boolean,
  importList: Array<any>,
  idRemove: string
};

class Editor extends Component<Object, StateT> {
  constructor(props) {
    super(props);
    this.state = {
      exportOpen: false,
      importOpen: false,
      deleteOpen: false,
      importList: [],
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
        <Preview
          activityTypeId={this.props.store.ui.showPreview.activityTypeId}
          config={this.props.store.ui.showPreview.config}
          dismiss={() => this.props.store.ui.setShowPreview(false)}
          className="bootstrap"
        />
      );
    }
    const setDelete = val => this.setState({ deleteOpen: val });
    const setIdRemove = val => this.setState({ idRemove: val });
    const setImportList = (val, fun?) => this.setState({ importList: val }, fun);

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
          />
          <ModalImport
            modalOpen={this.state.importOpen}
            setModal={val => this.setState({ importOpen: val })}
            importList={this.state.importList}
            {...{ setImportList, setDelete, setIdRemove }}
          />
          <ModalDelete
            modalOpen={this.state.deleteOpen}
            setModal={setDelete}
            remove={() =>{
              const promise = this.state.importOpen ? removeGraph(this.state.idRemove) : removeActivity(this.state.idRemove)
              promise.then(
                this.setState({
                  importList: this.state.importList.filter(
                    x => x.uuid !== this.state.idRemove
                  )
                }))
            }}
          />
          <div className={classes.container}>
            <div className={classes.main}>
              <EditorPanel />
            </div>
            <SidePanel
              importList={this.state.importList}
              {...{ setDelete, setIdRemove, setImportList }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(connect(Editor));
