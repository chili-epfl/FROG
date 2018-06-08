// @flow

import * as React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddCircle from '@material-ui/icons/AddCircle';
import { type LearningItemT, values } from 'frog-utils';
import { Provider } from 'mobx-react';
import { isEqual, omit } from 'lodash';

import { connect, listore } from './store';
import { learningItemTypesObj } from '../../activityTypes';
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

  render() {
    const { anchorEl, callback, handleClick, classes } = this.props;
    return (
      <div
        onDragOver={() => this.setState({ selected: true })}
        onMouseOver={() => {
          this.props.store.setOverCB(callback);
        }}
        onMouseLeave={() => {
          this.setState({ selected: false });
          this.props.store.setOverCB(null);
        }}
      >
        <Button
          className={classes.button}
          variant="fab"
          aria-owns={anchorEl ? 'simple-menu' : null}
          aria-haspopup="true"
          onClick={handleClick}
          color={this.state.selected ? 'secondary' : 'primary'}
        >
          <AddCircle style={{ color: 'white' }} />
        </Button>
      </div>
    );
  }
}

const AddButton = connect(ButtonRaw);
const WrappedAddButton = props => (
  <Provider store={listore}>
    <AddButton {...props} />
  </Provider>
);

class LearningItemChooser extends React.Component<
  {
    classes: Object,
    onCreate: Function,
    dataFn: Object
  },
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
    console.log('render');

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
      </>
    );
  }
}
export default withStyles(styles)(LearningItemChooser);
