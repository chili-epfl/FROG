// @flow
import React from 'react';

// $FlowFixMe
import styled from 'styled-components';
import SplitPane from 'react-split-pane';

import { connect } from './store';
import type { StoreProp } from './store';
import Graph from './Graph';
import { RenameBox } from './Rename';
import SidePanel from './SidePanel';
import GraphList from './GraphList';
import HelpModal from './HelpModal';

const Editor = (
  { store: { ui: { panOffset, graphWidth, changeGraphWidth } } }: StoreProp
) => (
  <SplitPane split="horizontal" allowResize={false}>
    <GraphConfigPanelContainer>
      <GraphList />
    </GraphConfigPanelContainer>
    <SplitPane
      split="vertical"
      defaultSize={1000}
      allowResize
      onChange={changeGraphWidth}
    >
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
      <SidebarContainer>
        <SidePanel />
      </SidebarContainer>
    </SplitPane>
  </SplitPane>
);

export default connect(Editor);

const GraphConfigPanelContainer = styled.div`
  background-color: #ccccff;
  padding: 5px;
  width: 100%;
`;

const SidebarContainer = styled.div`
  padding: 5px;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  overflow: scroll;
`;
