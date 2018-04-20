import React from 'react';
import classNames from 'classnames';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import { MenuItem, MenuList } from 'material-ui/Menu';
import Grow from 'material-ui/transitions/Grow';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';
import { Manager, Target, Popper } from 'react-popper';
import ClickAwayListener from 'material-ui/utils/ClickAwayListener';
import Undo from '@material-ui/icons/Undo';
import Check from '@material-ui/icons/Check';
import Add from '@material-ui/icons/Add';
import ContentCopy from '@material-ui/icons/ContentCopy';
import Delete from '@material-ui/icons/Delete';
import ImportExport from '@material-ui/icons/ImportExport';
import Image from '@material-ui/icons/Image';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Timeline from '@material-ui/icons/Timeline';
import Tooltip from 'material-ui/Tooltip';

import { exportGraph, importGraph, duplicateGraph } from '../utils/export';
import { connect, store } from '../store';
import exportPicture from '../utils/exportPicture';
import { removeGraph } from '../../../api/activities';
import { addGraph, assignGraph } from '../../../api/graphs';

const submitRemoveGraph = id => {
  removeGraph(id);
  store.setId(assignGraph());
};

const styles = theme => ({
  root: {
    display: 'flex'
  },
  popperClose: {
    pointerEvents: 'none'
  },
  undoButton: {
    marginTop: theme.spacing.unit,
    padding: 3,
    width: 35
  },
  button: {
    marginTop: theme.spacing.unit / 2,
    padding: 3,
    width: 35
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  }
});

export const UndoButton = connect(({ store: { undo } }) => (
  <UndoButtonComponent undo={undo} />
));

@withStyles(styles)
class UndoButtonComponent extends React.Component {
  render() {
    const { classes, undo } = this.props;
    return (
      <div className={classes.root}>
        <Tooltip
          id="tooltip-top"
          title="undo the last graph action"
          placement="top"
        >
          <Button onClick={undo} color="primary" className={classes.undoButton}>
            UNDO
            <Undo className={classes.rightIcon} />
          </Button>
        </Tooltip>
      </div>
    );
  }
}

@withStyles(styles)
class GraphActionMenu extends React.Component {
  state = {
    open: false
  };

  handleClick = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const {
      classes,
      overlapAllowed,
      graphId,
      toggleOverlapAllowed,
      setSidepanelOpen
    } = this.props;
    const { open } = this.state;

    return (
      <div className={classes.root}>
        <Manager>
          <Target>
            <Tooltip id="tooltip-top" title="graph actions" placement="top">
              <IconButton
                aria-owns={open ? 'menu-list' : null}
                aria-haspopup="true"
                onClick={this.handleClick}
                color="primary"
                className={classes.button}
              >
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
          </Target>
          <Popper
            placement="bottom-start"
            eventsEnabled={open}
            className={classNames({ [classes.popperClose]: !open })}
          >
            <ClickAwayListener onClickAway={this.handleClose}>
              <Grow
                in={open}
                id="menu-list"
                style={{ transformOrigin: '0 0 0' }}
              >
                <Paper>
                  <MenuList role="menu">
                    <MenuItem
                      onClick={() => {
                        toggleOverlapAllowed();
                        this.handleClose();
                      }}
                    >
                      {overlapAllowed && (
                        <Check
                          className={classes.leftIcon}
                          aria-hidden="true"
                        />
                      )}Overlap Allowed
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        store.setId(addGraph());
                        this.handleClose();
                      }}
                    >
                      <Add className={classes.leftIcon} aria-hidden="true" />Add
                      New Graph
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        duplicateGraph(graphId);
                        this.handleClose();
                      }}
                    >
                      <ContentCopy
                        className={classes.leftIcon}
                        aria-hidden="true"
                      />Copy Graph
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        submitRemoveGraph(graphId);
                        this.handleClose();
                      }}
                    >
                      <Delete className={classes.leftIcon} aria-hidden="true" />Delete
                      Current Graph
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        importGraph();
                        this.handleClose();
                      }}
                    >
                      <ImportExport
                        className={classes.leftIcon}
                        aria-hidden="true"
                      />Import Graph
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        exportGraph();
                        this.handleClose();
                      }}
                    >
                      <Timeline
                        className={classes.leftIcon}
                        aria-hidden="true"
                      />Export Graph
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        exportPicture();
                        this.handleClose();
                      }}
                    >
                      <Image className={classes.leftIcon} aria-hidden="true" />Export
                      Graph as Image
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setSidepanelOpen(false);
                        this.props.openImport();
                        this.handleClose();
                      }}
                    >
                      <ImportExport
                        className={classes.leftIcon}
                        aria-hidden="true"
                      />Import Graph from the Server
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        this.props.openExport();
                        this.handleClose();
                      }}
                    >
                      <Timeline
                        className={classes.leftIcon}
                        aria-hidden="true"
                      />Export Graph to the Server
                    </MenuItem>
                  </MenuList>
                </Paper>
              </Grow>
            </ClickAwayListener>
          </Popper>
        </Manager>
      </div>
    );
  }
}

export const ConfigMenu = connect(
  ({
    store: {
      overlapAllowed,
      graphId,
      toggleOverlapAllowed,
      ui: { setSidepanelOpen }
    },
    openExport,
    openImport
  }) => (
    <GraphActionMenu
      {...{
        overlapAllowed,
        graphId,
        toggleOverlapAllowed,
        setSidepanelOpen,
        openExport,
        openImport
      }}
    />
  )
);
