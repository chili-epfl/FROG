// @flow
import { Activities, Graphs } from '/imports/collections';

export const GraphCurrentVersion = 2;

// version 0 being where ac-image is ac-gallery

export const GraphIdUpgrades: Object = {
  '1': ({ graphId }: { graphId: string }) => {
    Activities.find({ graphId })
      .fetch()
      .filter(x => x.activityType === 'ac-image')
      .forEach(x =>
        Activities.update(x._id, { $set: { activityType: 'ac-gallery' } })
      );
    Graphs.update(graphId, { $set: { graphVersion: 1 } });
  },
  '2': ({ graphId }: { graphId: string }) => {
    console.log('upgrading to 2', graphId);
    Activities.find({ graphId })
      .fetch()
      .filter(x => x.activityType === 'ac-single-li')
      .forEach(x => {
        if (x.data.liType || x.data.liTypeEditor) {
          Activities.update(x._id, {
            $set: {
              activityType: x.data.liType || x.data.liTypeEditor,
              'data.allowEditing': true,
              'data.openIncomingInEdit': true,
              'data.liTypeEditor': x.data.liTypeEditor || x.data.liType
            },
            $unset: { 'data.noSubmit': '', liType: '' }
          });
        }
      });
    Graphs.update(graphId, { $set: { graphVersion: 2 } });
  }
};

export const GraphObjUpgrades: Object = {
  '1': graphObj => ({
    ...graphObj,
    graph: {
      ...graphObj.graph,
      graphVersion: graphObj.graph.graphVersion + 1
    },
    activities: graphObj.activities.map(x =>
      x.activityType === 'ac-image' ? { ...x, activityType: 'ac-gallery' } : x
    )
  })
};
