// @flow

import * as React from 'react';
import { withStyles } from '@material-ui/styles';
import ReactTooltip from 'react-tooltip';
import { Graphs } from '/imports/api/graphs';
import Grid from '@material-ui/core/Grid';
import Clear from '@material-ui/icons/Clear';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import { removeActivity } from '/imports/api/remoteActivities';
import { storeTemplateData, Activities } from '/imports/api/activities';
import { removeGraph } from '/imports/api/remoteGraphs';
import { LibraryStates } from '/imports/api/cache';
import { connect } from './store';
import Graph from './Graph';
import { RenameBox } from './Rename';
import SidePanel from './SidePanel';
import HelpModal from './HelpModal';
import ChangelogModal from './ChangelogModal';
import ModalExport from './RemoteControllers/ModalExport';
import ModalImport from './RemoteControllers/ModalImport';
import ModalDelete from './RemoteControllers/ModalDelete';
import { withRouter } from 'react-router';
import TopPanel from './TopPanel';
import Preview from '../Preview';
import { TopBarAccountsWrapper } from '/imports/containers/TopBarWrapper';
import { Breadcrumb } from '/imports/ui/Breadcrumb';
import { Button } from '/imports/ui/Button';

const styles = () => ({
  root: {
    height: '100vh',
    overflowX: 'auto'
  },
  editor: { height: 298, background: '#EAF1F8' },
  editorWithPanMap: { height: 150 },
  graphEditorWrapper: {
    display: 'flex'
  },
  preview: {
    position: 'relative',
    padding: '25px',
    width: 'calc(100vw - 400px)',
    height: 'calc(100vh - 50px - 300px)',
    overflow: 'auto'
  }
});

const EditorPanel = withStyles(styles)(({ classes }) => (
  <React.Fragment>
    <div className={classes.editor}>
      <ReactTooltip delayShow={500} />
      <Graph scaled hasTimescale isEditable />
    </div>
    <RenameBox />
  </React.Fragment>
));

type StateT = {
  exportOpen: boolean,
  importOpen: boolean,
  deleteOpen: boolean,
  locallyChanged: boolean,
  idRemove: Object
};

@connect
class Editor extends React.Component<Object, StateT> {
  constructor(props) {
    super(props);
    this.state = {
      exportOpen: false,
      importOpen: false,
      deleteOpen: false,
      locallyChanged: false,
      idRemove: {}
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
    const { classes, store, history } = this.props;
    const setDelete = val => this.setState({ deleteOpen: val });
    const setIdRemove = val => this.setState({ idRemove: val });
    const activityToPreview =
      store.ui.selected && Activities.findOne(store.ui.selected.id);
    return (
      <div className={classes.root}>
        <TopBarAccountsWrapper
          navigation={
            <>
              <Button
                variant="minimal"
                icon={<Clear />}
                onClick={() => history.push('/')}
              />
              <Breadcrumb paths={['Graph Editor']} />
            </>
          }
          actions={
            <TopPanel
              graphId={store.graphId}
              history={history}
              errors={store.graphErrors}
              openExport={() => this.setState({ exportOpen: true })}
              openImport={() => this.setState({ importOpen: true })}
              {...{
                setDelete,
                setIdRemove
              }}
            />
          }
        />
        <Grid container>
          <Grid item xs={12}>
            <ModalExport
              exportType="graph"
              modalOpen={this.state.exportOpen}
              setModal={val => this.setState({ exportOpen: val })}
              graphId={store.graphId}
              graphName={store}
              metadatas={LibraryStates.graphList.find(
                x => x.uuid === Graphs.findOne(store.graphId).parentId
              )}
              madeChanges={() => this.setState({ locallyChanged: true })}
            />
            <ModalImport
              modalOpen={this.state.importOpen}
              setModal={val => this.setState({ importOpen: val })}
              locallyChanged={this.state.locallyChanged}
              changesLoaded={() => this.setState({ locallyChanged: true })}
            />
            <ModalDelete
              modalOpen={this.state.deleteOpen}
              setModal={setDelete}
              remove={() =>
                this.state.idRemove.type === 'graph'
                  ? removeGraph(this.state.idRemove.id)
                  : removeActivity(this.state.idRemove.id, () =>
                      this.forceUpdate()
                    )
              }
            />
          </Grid>
          <Grid item xs={12}>
            <div className={classes.graphEditorWrapper}>
              <div>
                <SidePanel
                  madeChanges={() => this.setState({ locallyChanged: true })}
                  locallyChanged={this.state.locallyChanged}
                  changesLoaded={() => this.setState({ locallyChanged: true })}
                  {...{
                    setDelete,
                    setIdRemove
                  }}
                />
              </div>
              <div className={classes.preview}>
                {activityToPreview ? (
                  <Preview
                    activityTypeId={activityToPreview.activityType}
                    graphEditor
                    config={activityToPreview.data}
                    template={activityToPreview.template}
                    storeTemplateFn={data => {
                      storeTemplateData(activityToPreview._id, data);
                      window.alert('Template stored/updated');
                    }}
                  />
                ) : null}
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <Grid item xs>
              <EditorPanel />
            </Grid>
          </Grid>
        </Grid>
        <HelpModal
          show={store.ui.showHelpModal}
          hide={() => store.ui.setShowHelpModal(false)}
        />
        <ChangelogModal
          show={store.ui.showChangelogModal}
          hide={() => store.ui.setShowChangelogModal(false)}
        />
      </div>
    );
  }
}
const withRouterEditor = withRouter(Editor);
const StyledEditor = withStyles(styles)(withRouterEditor);

const SubscriptionWrapper = withTracker(({ graphId }) => {
  const subscription = Meteor.subscribe('teacher.graph', graphId);
  return { ready: subscription.ready() };
})(StyledEditor);

const RawGraph = ({ store }) => (
  <SubscriptionWrapper key={store.graphId} graphId={store.graphId} />
);

export default connect(RawGraph);

// <OperatorPreview
//   operatorTypeId={store.ui.selected.operatorTypeId}
//   config={store.ui.selected.config}
// />
