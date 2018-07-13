// @flow

import { Activities /* , Connections */ } from '/imports/api/activities';
import /* Operators */ '/imports/api/operators';

export const GraphCurrentVersion = 1;

// version 0 being where ac-image is ac-gallery

export const GraphUpgrades: Object = {
  '1': ({ graphId }: { graphId: string }) => {
    const allAct = Activities.find({ graphId }).fetch();
    allAct.forEach(x => x); // console.log(x));
  }
};
