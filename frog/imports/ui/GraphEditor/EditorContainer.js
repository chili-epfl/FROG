import React, { Component } from 'react';
import styled from 'styled-components';

import { connect } from './store';
import Graph from './Graph';
import { RenameBox } from './Rename';
import SidePanel from './SidePanel';
import HelpModal from './HelpModal';
import TopPanel from './TopPanel';
import ExpandButton from './SidePanel/ExpandButton';
import Preview from '../Preview/Preview';
import TopBar from '../App/TopBar';

const EditorPanel = () => (
  <div>
    <ExpandButton />
    <div style={{ height: 600 }}>
      <Graph scaled hasTimescale isEditable />
    </div>
    <RenameBox />
    <div className="bootstrap" style={{ height: 150 }}>
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
    if (this.props.store.ui.showPreview) {
      return (
        <Preview
          activityTypeId={this.props.store.ui.showPreview.activityTypeId}
          config={this.props.store.ui.showPreview.config}
          dismiss={() => this.props.store.ui.setShowPreview(false)}
        />
      );
    }
    return (
      <div style={{ height: '100%' }}>
        <TopBar />
        <TopPanel />
        <Container>
          <Main>
            <EditorPanel />
          </Main>
          <SidePanel />
        </Container>
      </div>
    );
  }
}

export default connect(Editor);

const Main = styled.div`
  height: 760px;
  flex: 3 0px;
  overflow: hide;
`;

const Container = styled.div`
  height: 95%;
  display: flex;
  flex-direction: row;
`;
