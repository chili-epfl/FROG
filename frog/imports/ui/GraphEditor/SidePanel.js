import React from 'react';
import { connect } from './store';
import Activities from '../Activities';
import Activity from './store/activity';

export default connect(({ store: { ui: { selected } } }) => {
  if (!selected) {
    return null;
  }
  if (!(selected instanceof Activity)) {
    return <h1>Not implemented for this item type yet</h1>;
  }
  return (
    <div>
      <h1>{selected.title}</h1>
      <Activities activityID={selected.id} />
    </div>
  );
});
