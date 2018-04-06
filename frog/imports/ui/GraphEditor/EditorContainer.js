import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';

import { connect } from './store';
import Graph from './Graph';
import { RenameBox } from './Rename';
import SidePanel from './SidePanel';
import HelpModal from './HelpModal';
import TopPanel from './TopPanel';
import Preview from '../Preview/Preview';
import TopBar from '../App/TopBar';
import ReactTooltip from 'react-tooltip';

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

class Editor extends Component {
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
    return (
      <div className={classes.root}>
        <TopBar barHeight={classes.root.paddingTop} />
        <div className={classes.gridContent}>
          <TopPanel />
          <div className={classes.container}>
            <div className={classes.main}>
              <EditorPanel />
            </div>
            <SidePanel />
          </div>
        </div>
        <ReactTooltip delayShow={500} />
      </div>
    );
  }
}

export default withStyles(styles)(connect(Editor));
