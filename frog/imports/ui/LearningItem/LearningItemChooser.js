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

class LearningItemChooser extends React.Component<
  { classes: Object, onCreate: Function, dataFn: Object },
  { anchorEl: any, open?: LearningItemT<any> }
> {
  state = {
    anchorEl: null,
    open: undefined
  };

  handleClick = (event: any) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl } = this.state;

    return (
      <div>
        <Button
          className={this.props.classes.button}
          variant="fab"
          aria-owns={anchorEl ? 'simple-menu' : null}
          aria-haspopup="true"
          onClick={this.handleClick}
          color="primary"
        >
          <AddCircle style={{ color: 'white' }} />
        </Button>
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
      </div>
    );
  }
}
export default withStyles(styles)(LearningItemChooser);
