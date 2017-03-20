// @flow
import React from 'react';

// $FlowFixMe
import styled from 'styled-components';
import Form from 'react-jsonschema-form';

import { connect } from './store';
import type { StoreProp } from './store';
import Graph from './Graph';
import Rename from './Rename';
import SidePanel from './SidePanel';
import GraphConfigPanel from './GraphConfigPanel';
import GraphList from './GraphList';
import HelpModal from './HelpModal';

const Editor = ({ store: { ui: { panOffset } } }: StoreProp) => (
  <div>
    <GraphConfigPanelContainer>
      <GraphList />
    </GraphConfigPanelContainer>
    <Row>
      <GraphContainer>
        <Graph width={1000} height={600} viewBox={`${panOffset} 0 1000 600`} />
        <Rename />
        <Graph width={1000} height={150} viewBox={'0 0 4000 600'} hasPanMap />
      </GraphContainer>
      <HelpModal />
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
  width: 1510px;
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
  width: 1000px;
  height: 760px;
`;

const SidebarContainer = styled.div`
  padding: 0px;
  width: 500px;
  background-color: #ffffff;
  margin-left: 10px;
  overflow: scroll;
`;

const GraphListContainer = styled.div`
  padding: 0px;
  width: 300px;
  background-color: #ccffcc;
  margin-right: 10px;
`;
