import React, { Component } from "react";
import { Provider } from "mobx-react";
import Form from "react-jsonschema-form";
import styled from 'styled-components'

import { connect, store } from "./store";
import Graph from "./Graph";
import Rename from "./Rename";
import SidePanel from './SidePanel'
import * as constants from './constants'

import "./App.css";

const Row = styled.div`
  padding: 0px;
  height: 1000px;
  position: fixed;
  top: 30px;
  margin: 0;
  display: flex;
`

  /* padding: 0; */
const GraphContainer = styled.li`
  list-style: none;
  width: 1150px;
  height: 1000px;
`

const SidebarContainer = styled.li`
  list-style: none;
  padding: 0px;
  width: 300px;
`

const SettingsContainer = styled.div`
  position: absolute;
  top: 900px;
`

const App = connect(({ store: { setId, panOffset, hasSelection }, id }) => {
  return (
  <div>
    <Row>
      <GraphContainer>
        <div style={{ position: "fixed", top: `${constants.GRAPH_TOP}px`, left: `${constants.GRAPH_LEFT}px` }}>
          <Graph
            width={1000}
            height={600}
            viewBox={`${panOffset} 0 1000 600`}
            preserveAspectRatio="xMinYMin slice"
            scaleFactor={1}
          />
        </div>
        <Rename />
        <div style={{ position: "fixed", left: "50px", top: "720px" }}>
          <Graph
            width={1000}
            height={150}
            viewBox={"0 0 4000 600"}
            preserveAspectRatio="xMinYMin slice"
            hasPanMap
            scaleFactor={4}
          />
        </div>
      </GraphContainer>
      <SidebarContainer>
        { !!hasSelection && <SidePanel /> }
      </SidebarContainer>
    </Row>
    <SettingsContainer>
      <Settings />
    </SettingsContainer>
  </div>
  )
});

export default class AppClass extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    store.setId(1)
  }

  render() { return(
    <Provider store={store}>
      <div>
        <App />
      </div>
    </Provider>
  )}
}

const settingsSchema = {
  type: "object",
  properties: { overlapAllowed: { type: "boolean", title: "Overlap allowed" } }
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
  if(store.renameOpen) { return }
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
    store.placeOperator('social')
  }
  if (e.keyCode === 80) {
    // p - product operator
    store.placeOperator('product')
  }
};

window.addEventListener("keydown", keyDown);
