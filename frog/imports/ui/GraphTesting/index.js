import * as React from 'react';
import { getInitialState, withDragDropContext } from 'frog-utils';
import {
  MosaicWindow,
  MosaicWithoutDragDropContext
} from 'react-mosaic-component';
import { withTracker } from 'meteor/react-meteor-data';
import { Sessions } from '/imports/api/sessions';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';

const styles = {
  div: { top: '50px', height: '100%' },
  iframe: { height: '100%', width: '100%' }
};

const Test = ({ slug, classes }) => (
  <div className={classes.div}>
    {slug ? (
      <MosaicWithoutDragDropContext
        renderTile={(name, path) => (
          <MosaicWindow
            path={path}
            toolbarControls={[<div key={1} />]}
            key={name}
            title={name}
          >
            <iframe
              className={classes.iframe}
              title={name}
              src={`/${slug}?login=${name}`}
            />
          </MosaicWindow>
        )}
        initialValue={getInitialState(['John', 'Per', 'Nina', 'Ole'])}
      />
    ) : (
      <h3>No session selected in Session View</h3>
    )}
  </div>
);

const TestContext = compose(
  withDragDropContext,
  withStyles(styles)
)(Test);

export default withTracker(() => {
  const sessionId = Meteor.user().profile?.controlSession;
  if (!sessionId) {
    return {};
  }
  const slug = Sessions.findOne(sessionId)?.slug;
  console.log(slug);
  return { slug };
})(TestContext);
