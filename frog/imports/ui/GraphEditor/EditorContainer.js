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
    <Graph
      width={graphWidth}
      height={600}
      viewBox={[panOffset, 0, graphWidth, 600].join(' ')}
    />
    <RenameBox />
    <Graph
      width={graphWidth}
      height={150}
      viewBox={[0, 0, 4 * graphWidth, 600].join(' ')}
      hasPanMap
    />
    <HelpModal />
  </div>
);
// { store: { ui: { panOffset, graphWidth, changeGraphWidth } } }: StoreProp

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = { width: 0 };
  }

  componentDidMount() {
    const that = this;
    window.addEventListener('resize', () => that.recalculate(that));
    this.recalculate(that);
  }

  recalculate(that) {
    if (that.graphRef) {
      const width = that.graphRef.getBoundingClientRect().width;
      console.log(width);
      that.props.store.ui.changeGraphWidth(width);
    }
  }

  render() {
    return (
      <div>
        <TopPanel />
        <Row>
          <div
            style={{ flex: '1 1', height: '760px' }}
            ref={ref => this.graphRef = ref}
          >
            <EditorPanel
              panOffset={this.props.store.ui.panOffset}
              graphWidth={this.props.store.ui.graphWidth}
            />
          </div>
          <SidebarContainer>
            <SidePanel />
          </SidebarContainer>
        </Row>
      </div>
    );
  }
}

export default connect(Editor);

const Row = styled.div`
  display: flex;
  position: relative;
  padding: 0px;
  height: 760px;
  margin: 0px;
`;
const SidebarContainer = styled.div`
  padding: 0px;
  flex: 0 0 500px;
  background-color: #ffffff;
  margin-left: 10px;
  overflow: scroll;
`;
