import React, { Component } from 'react';
// $FlowFixMe
import styled from 'styled-components';

import { connect } from './store';
import type { StoreProp } from './store';
import Graph from './Graph';
import { RenameBox } from './Rename';
import SidePanel from './SidePanel';
import HelpModal from './HelpModal';
import TopPanel from './TopPanel';

const EditorPanel = ({ panOffset, graphWidth }) => (
  <div>
    <div style={{ height: 600 }}>
      <Graph
        width={graphWidth}
        height={600}
        viewBox={[panOffset, 0, graphWidth, 600].join(' ')}
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
          {this.props.store.ui.selected &&
            <SidebarContainer>
              <SidePanel />
            </SidebarContainer>}
        </Container>
      </div>
    );
  }
}

export default connect(Editor);

const Main = styled.div`
  padding: 0px;
  height: 760px;
  margin-right: 10px;
  flex: 3 0px;
  overflow: hide;
  padding-rigth: 5px;
`;

const SidebarContainer = styled.div`
  padding: 0px;
  flex: 0 auto;
  width: 500px;
  background-color: #ffffff;
  overflow: scroll;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;
