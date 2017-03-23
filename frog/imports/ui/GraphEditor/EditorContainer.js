// @flow
import React from 'react';

import SplitPane from 'react-split-pane';

import { connect } from './store';
import type { StoreProp } from './store';
import Graph from './Graph';
import { RenameBox } from './Rename';
import SidePanel from './SidePanel';
import GraphList from './GraphList';
import HelpModal from './HelpModal';
import GraphConfigPanel from './GraphConfigPanel';
import Settings from './Settings';

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

const TopPanel = () => (
  <div id="topPanel">
    <GraphList />
    <GraphConfigPanel />
    <Settings />
  </div>
);

const Editor = (
  { store: { ui: { panOffset, graphWidth, changeGraphWidth } } }: StoreProp
) => (
  <SplitPane split="horizontal" allowResize={false}>
    <TopPanel />
    <SplitPane
      split="vertical"
      defaultSize={1000}
      allowResize
      onChange={changeGraphWidth}
    >
      <EditorPanel panOffset={panOffset} graphWidth={graphWidth} />
      <div id="sidePanel">
        <SidePanel />
      </div>
    </SplitPane>
  </SplitPane>
);

export default connect(Editor);
