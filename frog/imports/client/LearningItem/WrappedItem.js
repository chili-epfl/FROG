import * as React from 'react';
import { toJS } from 'mobx';
import { Provider } from 'mobx-react';
import { omit, isEqual } from 'lodash';
import { DraggableCore } from 'react-draggable';
import InsertLink from '@material-ui/icons/InsertLink';
import NoteAdd from '@material-ui/icons/NoteAdd';

import { learningItemTypesObj } from '/imports/activityTypes';
import { connect, listore } from './store';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    overflow: 'auto'
  },
  button: {
    color: '#AA0000',
    width: 36,
    height: 36
  },
  liTools: {
    position: 'absolute',
    width: '100%',
    visibility: 'hidden'
  },
  liContainer: {
    '&:hover $liTools': {
      visibility: 'visible'
    }
  }
});

class Wrapped extends React.Component<*, *> {
  render() {
    return (
      <div className={classes.liContainer}>
        <Paper className={classes.root} elevation={10} square>
          <div className={classes.liTools}>
            <IconButton
              disableRipple
              className={`${classes.button} li-close-btn`}
            >
              <Close />
            </IconButton>
            {liType !== 'li-richText' && get(LiTypeObject, 'Editor') && (
              <IconButton
                disableRipple
                style={{ float: 'right' }}
                className={`${classes.button} li-edit-btn`}
              >
                {liView === LiViewTypes.EDIT ? <Save /> : <Create />}
              </IconButton>
            )}
            {get(LiTypeObject, 'ThumbViewer') && get(LiTypeObject, 'Viewer') && (
              <IconButton
                disableRipple
                style={{ float: 'right' }}
                className={`${classes.button} li-zoom-btn`}
              >
                {liZoomState === LiViewTypes.THUMB ? <ZoomIn /> : <ZoomOut />}
              </IconButton>
            )}
          </div>
          {children}
        </Paper>
      </div>
    );
  }
}

Wrapped.displayName = 'LIWrapper';

export default withStyles(styles)(Wrapped);
