// @flow

import { Activities } from '/imports/api/activities';
import { Graphs } from '/imports/api/graphs';

export const GraphCurrentVersion = 1;

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
  }
};

export const GraphObjUpgrades: Object = {
  '1': graphObj => ({
    ...graphObj,
    graph: { ...graphObj.graph, graphVersion: graphObj.graph.graphversion + 1 },
    activities: graphObj.activities.map(x =>
      x.activityType === 'ac-image' ? { ...x, activityType: 'ac-gallery' } : x
    )
  })
};
