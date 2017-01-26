import React from "react";
import { Provider } from "mobx-react";
import Form from "react-jsonschema-form";
import DevTools from "mobx-react-devtools";

import { connect, store } from "./store";
import Graph from "./Graph";
import Rename from "./Rename";

import "./App.css";

const App = connect(({ store: { panOffset } }) => (
  <div>
    <DevTools />
    <div className="App">
      <div style={{ position: "fixed", top: "30px", left: "150px" }}>
        <Graph
          width={1000}
          height={600}
          viewBox={`${panOffset} 0 1000 600`}
          preserveAspectRatio="xMinYMin slice"
          scaleFactor={1}
        />
      </div>
      <Rename />
      <div style={{ position: "fixed", left: "150px", top: "650px" }}>
        <Graph
          width={1000}
          height={150}
          viewBox={"0 0 4000 600"}
          preserveAspectRatio="xMinYMin slice"
          hasPanMap
          scaleFactor={4}
        />
        <Settings />
      </div>
    </div>
  </div>
));

export default () => (
  <Provider store={store}>
    <App />
  </Provider>
);

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
