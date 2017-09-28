// @flow
import React from 'react';
import { DropdownButton, MenuItem, Button } from 'react-bootstrap';

import {
  doImportGraph,
  exportGraph,
  importGraph,
  duplicateGraph
} from '../utils/export';
import { connect, store } from '../store';
import exportPicture from '../utils/exportPicture';
import { removeGraph, deleteDatabase } from '../../../api/activities';
import { addGraph, assignGraph } from '../../../api/graphs';

const submitRemoveGraph = id => {
  removeGraph(id);
  store.setId(assignGraph());
};

export const UndoButton = connect(({ store: { undo } }) =>
  <Button onClick={undo}>
    <i className="fa fa-undo" aria-hidden="true" /> Undo
  </Button>
);

const importGithub = graph =>
  fetch(
    'https://api.github.com/repos/chili-epfl/frog-graphs/contents/' +
      graph +
      '?client_id=Iv1.78b6e6a6ad7b5744&client_secret=f232b83d958985d812e57fab49850caba1085fdc'
  )
    .then(e => e.json())
    .then(e => doImportGraph(atob(e.content)));

export const ConfigMenu = connect(
  ({ store: { overlapAllowed, graphId, toggleOverlapAllowed } }) =>
    <DropdownButton
      id="settings"
      title={
        <span>
          <i className="fa fa-bars" aria-hidden="true" /> Menu
        </span>
      }
    >
      <MenuItem eventKey="1" onSelect={toggleOverlapAllowed}>
        {overlapAllowed && <i className="fa fa-check" aria-hidden="true" />}
        Overlap allowed
      </MenuItem>
      <MenuItem divider />
      <MenuItem eventKey="5" onSelect={() => store.setId(addGraph())}>
        Add new graph
      </MenuItem>
      <MenuItem eventKey="9" onSelect={() => duplicateGraph(graphId)}>
        Duplicate graph
      </MenuItem>
      <MenuItem eventKey="7" onSelect={() => submitRemoveGraph(graphId)}>
        Delete current graph
      </MenuItem>
      <MenuItem divider />
      <MenuItem eventKey="2" onSelect={exportGraph}>
        Export graph
      </MenuItem>
      <MenuItem eventKey="3" onSelect={importGraph}>
        Import graph
      </MenuItem>
      <MenuItem eventKey="4" onSelect={exportPicture}>
        Export as image
      </MenuItem>
      <MenuItem divider />
      <MenuItem header>Import graphs from GitHub</MenuItem>
      {store.githubGraphs.map(graph =>
        <MenuItem key={graph} onSelect={() => importGithub(graph)}>
          {graph}
        </MenuItem>
      )}
      <MenuItem onSelect={store.refreshGithub}>
        <i>Refresh list</i>
      </MenuItem>
      <MenuItem divider />
      <MenuItem onSelect={deleteDatabase}>Delete entire database</MenuItem>
    </DropdownButton>
);
