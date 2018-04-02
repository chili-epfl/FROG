// @flow
import * as React from 'react';
import Button from 'material-ui/Button';
import Menu, { MenuItem } from 'material-ui/Menu';
import { withStyles } from 'material-ui/styles';
import Dialog, { DialogTitle } from 'material-ui/Dialog';
import AddCircle from 'material-ui-icons/AddCircle';

import {
  learningItemTypesObj,
  type learningItemTypeT
} from './learningItemTypes';
import LearningItem from './LearningItemRenderer';

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
  { classes: Object, onCreate: Function, meta?: Object },
  { anchorEl: any, open?: learningItemTypeT }
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
          <AddCircle />
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          {Object.keys(learningItemTypesObj).map(x => {
            const item = learningItemTypesObj[x];
            return (
              <MenuItem
                key={item.id}
                onClick={() =>
                  this.setState({ open: item, anchorEl: undefined })
                }
              >
                {item.name}
              </MenuItem>
            );
          })}
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
                li={this.state.open.id}
                type="create"
                meta={this.props.meta}
                onCreate={id => {
                  this.setState({ open: undefined, anchorEl: undefined });
                  this.props.onCreate(id);
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
