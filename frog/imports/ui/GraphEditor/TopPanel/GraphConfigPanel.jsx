import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { ChangeableText } from 'frog-utils';

import { connect, store } from '../store';
import { Graphs, renameGraph } from '../../../api/graphs';
import { ValidButton } from '../Validator';

const Config = ({ graph }) =>
  <div style={{ textAlign: 'center' }}>
    <span
      style={{
        color: '#000000',
        fontSize: '20px',
        fontWeight: '900'
      }}
    >
      <ChangeableText
        onlyHover
        value={graph ? graph.name : 'untitled'}
        onSubmit={e => {
          renameGraph(graph._id, e);
        }}
      />
    </span>
    <span
      style={{
        marginLeft: '20px',
        fontSize: '16px',
        color: '#000000'
      }}
    >
      <ChangeableText
        onlyHover
        style={{ width: '60px' }}
        value={graph ? graph.duration : 30}
        onSubmit={e => store.changeDuration(parseInt(e, 10))}
      />{' '}
      mins.
    </span>
  </div>;

const GraphConfigPanel = createContainer(
  props => ({ ...props, graph: Graphs.findOne({ _id: props.graphId }) }),
  Config
);

export default connect(({ store: { graphId } }) =>
  <div
    style={{
      display: 'flex',
      flexDirection: 'row'
    }}
  >
    <ValidButton />
    <GraphConfigPanel graphId={graphId} />
  </div>
);
