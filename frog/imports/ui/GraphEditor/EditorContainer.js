import React, { Component } from 'react';
import styled from 'styled-components';

import { connect } from './store';
import Graph from './Graph';
import { RenameBox } from './Rename';
import SidePanel from './SidePanel';
import HelpModal from './HelpModal';
import TopPanel from './TopPanel';
import ExpandButton from './SidePanel/ExpandButton';

const EditorPanel = ({ panOffset, graphWidth }) => (
  <div>
    <ExpandButton />
    <div style={{ height: 600 }}>
      <Graph
        width={graphWidth}
        height={600}
        viewBox={[panOffset, 0, graphWidth, 600].join(' ')}
        scaled
        hasTimescale
        isEditable
      />
    </div>
    <RenameBox />
    <div style={{ height: 150 }}>
      <Graph
        width={graphWidth}
        height={150}
        viewBox={[0, 0, 4 * graphWidth, 600].join(' ')}
        hasPanMap
      />
    </div>
    <HelpModal />
  </div>
);

class Editor extends Component {
  componentDidMount() {
    window.addEventListener('resize', () => this.props.store.ui.updateWindow());
    this.props.store.ui.updateWindow();
  }

  render() {
    return (
      <div>
        <TopPanel />
        <Container>
          <Main>
            <EditorPanel
              panOffset={this.props.store.ui.panOffset}
              graphWidth={this.props.store.ui.graphWidth}
            />
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
  display: flex;
  flex-direction: row;
`;
