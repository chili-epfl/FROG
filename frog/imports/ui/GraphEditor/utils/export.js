import Stringify from 'json-stable-stringify';

import { Activities, Operators, Connections } from '../../../api/activities';
import { Graphs } from '../../../api/graphs';

export const exportGraph = graphId => {
  return Stringify({
    graphId: graphId,
    graph: Graphs.find({ graphId }).fetch[0],
    activities: Activities.find({ graphId }).fetch(),
    operators: Operators.find({ graphId }).fetch(),
    connections: Connections.find({ graphId }).fetch()
  });
};
