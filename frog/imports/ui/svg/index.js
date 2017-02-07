import React, { Component } from 'react';
import { Provider } from 'mobx-react';
import Form from 'react-jsonschema-form';
import styled from 'styled-components';
import { createContainer } from 'meteor/react-meteor-data';

import { removeGraph } from '../../api/activities';
import { Graphs, addGraph } from '../../api/graphs';

import { connect, store } from './store';
import Graph from './Graph';
import Rename from './Rename';
import SidePanel from './SidePanel';

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

const GL = createContainer(
  props => ({ ...props, graphs: Graphs.find().fetch() }),
  ({ graphs, graphId }) => (
    <div>
      <h3>Graph list</h3>
      <button
        className="btn btn-primary btn-sm"
        onClick={() => store.setId(addGraph())}
      >
        New
      </button>
      <ul>
        {graphs.length ? graphs.map(graph => (
              <li style={{ listStyle: 'none' }} key={graph._id}>
                <a href="#" onClick={() => removeGraph(graph._id)}>
                  <i className="fa fa-times" />
                </a>
                <a href="#" onClick={() => store.setId(graph._id)}>
                  <i className="fa fa-pencil" />
                </a>
                {graph._id} {graph._id === graphId ? ' (current)' : null}
              </li>
            )) : <li>No graph</li>}
      </ul>
    </div>
  )
);

const GraphList = connect(({ store: { id } }) => <GL graphId={id} />);

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
    store.setId(1);
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
