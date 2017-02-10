// @flow
import React from 'react';
import styled from 'styled-components';

import { connect } from './store';
import type { StoreProp } from './store';
import Graph from './Graph';
import Rename from './Rename';
import SidePanel from './SidePanel';
import GraphConfigPanel from './GraphConfigPanel';
import GraphList from './GraphList';

const Editor = ({ store: { ui: { panOffset } } }: StoreProp) => (
  <div>
    <GraphConfigPanelContainer>
      <GraphConfigPanel />
    </GraphConfigPanelContainer>
    <Row>
      <GraphListContainer>
        <GraphList />
      </GraphListContainer>
      <GraphContainer>
        <Graph
          width={1000}
          height={600}
          viewBox={`${panOffset} 0 1000 600`}
          preserveAspectRatio="xMinYMin slice"
          scaleFactor={1}
        />
        <Rename />
        <Graph
          width={1000}
          height={150}
          viewBox={'0 0 4000 600'}
          preserveAspectRatio="xMinYMin slice"
          hasPanMap
          scaleFactor={4}
        />
      </GraphContainer>
      <SidebarContainer>
        <SidePanel />
      </SidebarContainer>
    </Row>
  </div>
);

export default connect(Editor);

const GraphConfigPanelContainer = styled.div`
  position: relative;
  background-color: #ccccff;
  padding: 10px;
  margin-bottom: 10px;
`;

const Row = styled.div`
  position: relative;
  padding: 0px;
  height: 760px;
  margin: 0px;
  display: flex;
`;

/* padding: 0; */
const GraphContainer = styled.div`
  position: relative;
  width: 1150px;
  height: 760px;
`;

const SidebarContainer = styled.div`
  padding: 0px;
  width: 300px;
  background-color: #ccffff;
  margin-left: 10px;
`;

const GraphListContainer = styled.div`
  padding: 0px;
  width: 300px;
  background-color: #ccffcc;
  margin-right: 10px;
`;
