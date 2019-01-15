// @flow

import * as React from 'react';
import Fab from '@material-ui/core/Fab';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import { Provider } from 'mobx-react';
import { isEqual, omit } from 'lodash';
import InsertLink from '@material-ui/icons/InsertLink';
import NoteAdd from '@material-ui/icons/NoteAdd';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddCircle from '@material-ui/icons/AddCircle';
import { type LearningItemT, values } from 'frog-utils';

import { connect, listore } from './store';
import { learningItemTypesObj } from '/imports/activityTypes';
import LearningItem from './index';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  dialog: {
    width: '600px',
    height: '600px'
  }
});

class ButtonRaw extends React.Component<*, *> {
  state = { selected: false };

  mounted: boolean;

  componentDidMount = () => (this.mounted = true);

  componentWillUnmount = () => (this.mounted = false);

  render() {
    const { anchorEl, callback, handleClick, classes } = this.props;
    return (
      <div
        onMouseOver={() => {
          if (this.mounted && this.props.store.dragState) {
            this.setState({ selected: true });
            this.props.store.setOverCB(callback);
          }
        }}
        onMouseLeave={() => {
          if (this.mounted) {
            this.setState({ selected: false });
            this.props.store.setOverCB(null);
          }
        }}
      >
        <Fab
          className={classes.button}
          aria-owns={anchorEl ? 'simple-menu' : null}
          aria-haspopup="true"
          onClick={handleClick}
          color={this.state.selected ? 'secondary' : 'primary'}
        >
          <AddCircle style={{ color: 'white' }} />
        </Fab>
      </div>
    );
  }
}
const DragIconRaw = ({ store }) =>
  store.dragState && (
    <div
      style={{
        position: 'fixed',
        zIndex: 99,
        top: store.coords[1],
        left: store.coords[0],
        pointerEvents: 'none'
      }}
    >
      {store.dragState.shiftKey ? (
        <NoteAdd style={{ fontSize: 36 }} />
      ) : (
        <InsertLink style={{ fontSize: 36 }} />
      )}
    </div>
  );
const DragIcon = connect(DragIconRaw);
const WrappedDragIcon = props => (
  <Provider store={listore}>
    <DragIcon {...props} />
  </Provider>
);
const AddButton = connect(ButtonRaw);
const WrappedAddButton = props => (
  <Provider store={listore}>
    <AddButton {...props} />
  </Provider>
);

class LearningItemChooser extends React.Component<
  { classes: Object, onCreate: Function, dataFn: Object },
  { anchorEl: any, open?: LearningItemT<any>, selected: boolean }
> {
  state = {
    anchorEl: null,
    open: undefined,
    selected: false
  };

  handleClick = (event: any) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  callback = e => {
    this.props.onCreate(e.item);
  };

  shouldComponentUpdate(nextProps: any, nextState: Object) {
    return (
      !isEqual(
        omit(nextProps, ['dataFn', 'classes', 'onCreate']),
        omit(this.props, ['dataFn', 'classes', 'onCreate'])
      ) || !isEqual(nextState, this.state)
    );
  }

  render() {
    const { anchorEl } = this.state;

    return (
      <>
        <WrappedAddButton
          anchorEl={this.state.anchorEl}
          handleClick={this.handleClick}
          classes={this.props.classes}
          callback={this.callback}
        />
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          {values(learningItemTypesObj)
            .filter(x => x.Creator || x.Editor)
            .map(item => (
              <MenuItem
                key={item.id}
                onClick={() => {
                  this.setState({ open: item, anchorEl: undefined });
                }}
              >
                {item.name}
              </MenuItem>
            ))}
        </Menu>
        {this.state.open && (
          <Dialog
            open
            onClose={() => this.setState({ open: undefined })}
            aria-labelledby="simple-dialog-title"
          >
            <DialogTitle id="simple-dialog-title">
              Add {this.state.open.name}
            </DialogTitle>
            <div className={this.props.classes.dialog}>
              <LearningItem
                liType={this.state.open.id}
                type="create"
                dataFn={this.props.dataFn}
                onCreate={id => {
                  this.setState({ open: undefined, anchorEl: undefined });
                  if (this.props.onCreate) {
                    this.props.onCreate(id);
                  }
                }}
              />
            </div>
          </Dialog>
        )}
        <WrappedDragIcon />
      </>
    );
  }
}
export default withStyles(styles)(LearningItemChooser);
