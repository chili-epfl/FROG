import React, { Component } from 'react';
import { Provider } from 'mobx-react';
import Form from 'react-jsonschema-form';
import styled from 'styled-components';

import { connect, store } from './store';
import Graph from './Graph';
import Rename from './Rename';
import SidePanel from './SidePanel';
import { GraphList } from './GraphList';
import { assignGraph } from '../../api/graphs';

import './App.css';

const Row = styled.div`
  padding: 0px;
  height: 1000px;
  position: relative;
  margin: 0;
  display: flex;
`;

/* padding: 0; */
const GraphContainer = styled.div`
  width: 1150px;
  height: 1000px;
`;

const SidebarContainer = styled.div`
  padding: 0px;
  width: 300px;
`;

const GraphListContainer = styled.div`
  padding: 0px;
  width: 300px;
`;

const SettingsContainer = styled.div`
  position: absolute;
  top: 900px;
`;

const App = connect(({ store: { panOffset, hasSelection } }) => (
  <div>
    <Row>
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
        {!!hasSelection && <SidePanel />}
      </SidebarContainer>
      <GraphListContainer>
        <GraphList />
      </GraphListContainer>
    </Row>
    <SettingsContainer>
      <Settings />
    </SettingsContainer>
  </div>
));

export default class AppClass extends Component {
  componentWillMount() {
    store.setId(assignGraph());
  }

  render() {
    return (
      <Provider store={store}>
        <div>
          <App />
        </div>
      </Provider>
    );
  }
}

const settingsSchema = {
  type: 'object',
  properties: { overlapAllowed: { type: 'boolean', title: 'Overlap allowed' } }
};

const Settings = connect(({ store: { updateSettings, undo, canUndo } }) => (
  <Form
    schema={settingsSchema}
    onChange={({ formData }) => updateSettings(formData)}
  >
    <button type="button" disabled={!canUndo} onClick={undo}>Undo</button>
  </Form>
));

const keyDown = e => {
  if (store.renameOpen) {
    return;
  }
  if (e.keyCode === 27) {
    // esc
    store.cancelAll();
    store.unselect();
  }
  if (e.keyCode === 8) {
    // backspace
    store.deleteSelected();
  }
  if (e.keyCode === 83) {
    // s - social operator
    store.placeOperator('social');
  }
  if (e.keyCode === 80) {
    // p - product operator
    store.placeOperator('product');
  }
};

window.addEventListener('keydown', keyDown);
