import {getUsername} from './users';
import { omitBy, isNil } from 'lodash';

import { uuid } from '/imports/frog-utils';
import { Graphs } from '/imports/api/graphs';
import { LibraryStates } from './cache';
import { graphToString, doImportGraph } from './exportGraph';

const RemoteServer =
  (Meteor.settings && Meteor.settings.public.remoteServer) ||
  'https://icchilisrv4.epfl.ch:5500/graphs';

export const removeGraph = (id: string, callback: ?Function) => {
  fetch(RemoteServer + '?uuid=eq.' + id, {
    method: 'PATCH',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ deleted: true })
  }).then(() => collectGraphs(callback));
};

export const updateGraph = (
  id: string,
  graph: Object,
  state: Object,
  callback: ?Function
) => {
  const newGraph = omitBy(
    {
      title: state.title,
      description: state.description,
      tags: '{' + state.tags.join(',') + '}',
      is_public: state.public,
      graph: graphToString(graph)
    },
    isNil
  );
  fetch(RemoteServer + '?uuid=eq.' + id, {
    method: 'PATCH',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(newGraph)
  }).then(() => collectGraphs(callback));
};

export const loadGraphMetaData = (id: string, callback: ?Function) => {
  fetch(
    RemoteServer + '?uuid=eq.' + id + '&select=title,owner_id,description,tags'
  )
    .then(e => e.json())
    .then(e => {
      const toChangeIdx = LibraryStates.graphList.findIndex(x => x.uuid === id);
      if (toChangeIdx >= 0) {
        LibraryStates.graphList[toChangeIdx] = {
          uuid: id,
          title: e[0].title,
          owner_id: e[0].owner_id,
          description: e[0].description,
          tags: e[0].tags
        };
      } else
        LibraryStates.graphList.push({
          uuid: id,
          title: e[0].title,
          owner_id: e[0].owner_id,
          description: e[0].description,
          tags: e[0].tags
        });
      if (callback) {
        callback();
      }
    });
};

export const refreshGraphDate = () =>
  (LibraryStates.lastRefreshGraph = new Date());

export const collectGraphs = (callback: ?Function) =>
  fetch(
    RemoteServer +
      '?select=uuid,title,description,tags,timestamp,owner_id&deleted=not.is.true&or=(is_public.not.is.false,owner_id.eq.' +
      getUsername()+
      ')'
  )
    .then(e => e.json())
    .then(r => {
      LibraryStates.graphList = r;
      refreshGraphDate();
      if (callback) callback();
    });

export const checkDateGraph = (callback: ?Function) => {
  if (
    !LibraryStates.lastRefreshGraph ||
    new Date() - LibraryStates.lastRefreshGraph > 60000
  ) {
    collectGraphs(callback);
  }
};

export const sendGraph = (state: Object, props: Object) => {
  const newId = uuid();
  const graph = {
    title: state.title,
    description: state.description,
    tags: '{' + state.tags.join(',') + '}',
    parent_id: Graphs.findOne(props.graphId).parentId,
    owner_id: getUsername(),
    is_public: state.public,
    uuid: newId,
    graph: graphToString(props.graphId)
  };
  fetch(RemoteServer, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(graph)
  });
  Graphs.update(props.graphId, {
    $set: { parentId: newId }
  });
  LibraryStates.graphList.push({
    uuid: newId,
    title: state.title,
    owner_id: getUsername(),
    description: state.description,
    tags: state.tags,
    timestamp: new Date()
  });
};

export const importGraph = (store: Object, id: string, title: string) => {
  fetch(RemoteServer + '?uuid=eq.' + id)
    .then(e => e.json())
    .then(e => {
      const graphId = doImportGraph(store, e[0].graph, title);
      Graphs.update({ _id: graphId }, { $set: { parentId: id } });
    });
};
