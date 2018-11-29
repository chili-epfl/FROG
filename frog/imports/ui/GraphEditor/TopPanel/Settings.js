// @flow

import React from 'react';
import { Meteor } from 'meteor/meteor';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { withStyles } from '@material-ui/core/styles';
import Undo from '@material-ui/icons/Undo';
import Add from '@material-ui/icons/Add';
import FileCopy from '@material-ui/icons/FileCopy';
import Delete from '@material-ui/icons/Delete';
import ExitToApp from '@material-ui/icons/ExitToApp';
import ImportExport from '@material-ui/icons/ImportExport';
import Image from '@material-ui/icons/Image';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Timeline from '@material-ui/icons/Timeline';
import Tooltip from '@material-ui/core/Tooltip';
import Help from '@material-ui/icons/Help';

import {
  addGraph,
  assignGraph,
  removeGraph,
  Graphs
} from '/imports/api/graphs';
import { loadGraphMetaData } from '/imports/api/remoteGraphs';
import { LibraryStates } from '/imports/api/cache';

import { exportGraph, importGraph, duplicateGraph } from '../utils/export';
import { connect, store } from '../store';
import exportPicture from '../utils/exportPicture';

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
  helpButton: {
    marginTop: theme.spacing.unit,
    padding: 3,
    width: 35,
    marginRight: 70
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

const HelpButtonComponent = ({ classes, store: { ui } }) => (
  <div className={classes.root}>
    <Tooltip id="tooltip-top" title="Show instructions" placement="top">
      <Button
        onClick={() => ui.setShowHelpModal(true)}
        color="primary"
        className={classes.helpButton}
      >
        HELP
        <Help className={classes.rightIcon} />
      </Button>
    </Tooltip>
  </div>
);

const UndoButtonComponent = ({ classes, store: { undo } }) => (
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

export const UndoButton = withStyles(styles)(connect(UndoButtonComponent));
export const HelpButton = withStyles(styles)(connect(HelpButtonComponent));

const MenuItemDeleteFromServer = ({
  setIdRemove,
  parentId,
  setDelete,
  classes,
  handleClose
}) =>
  !LibraryStates.graphList.find(x => x.uuid === parentId) ||
  LibraryStates.graphList.find(x => x.uuid === parentId).owner_id ===
    Meteor.user().username ? (
    <MenuItem
      onClick={() => {
        if (setIdRemove) setIdRemove({ type: 'graph', id: parentId });
        setDelete(true);
        handleClose();
      }}
    >
      <Delete className={classes.leftIcon} aria-hidden="true" />
      Remove Current Graph from the Server
    </MenuItem>
  ) : null;

class GraphActionMenu extends React.Component<*, *> {
  state = {
    open: false,
    anchorEl: null
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const {
      classes,
      setDelete,
      setIdRemove,
      store: {
        graphId,
        ui: { setSidepanelOpen }
      }
    } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    const graph = Graphs.findOne(graphId);
    const parentId = graph?.parentId;
    const sessionId = graph?.sessionId;
    return (
      <div className={classes.root}>
        <IconButton
          aria-owns={open ? 'menu-list' : null}
          aria-haspopup="true"
          onClick={this.handleClick}
          color="primary"
          className={classes.button}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          open={open}
          anchorEl={anchorEl}
          onClose={this.handleClose}
          id="menu-list"
        >
          <MenuItem
            onClick={() => {
              store.setId(addGraph());
              this.handleClose();
            }}
          >
            <Add className={classes.leftIcon} aria-hidden="true" />
            Add New Graph
          </MenuItem>
          <MenuItem
            onClick={() => {
              duplicateGraph(graphId);
              this.handleClose();
            }}
          >
            <FileCopy className={classes.leftIcon} aria-hidden="true" />
            Duplicate Graph
          </MenuItem>
          <MenuItem
            onClick={() => {
              submitRemoveGraph(graphId);
              this.handleClose();
            }}
          >
            <Delete className={classes.leftIcon} aria-hidden="true" />
            Delete Current Graph
          </MenuItem>
          {sessionId && (
            <MenuItem
              onClick={() => {
                this.handleClose();
                Graphs.update(graph._id, {
                  $set: { name: graph.name.replace(/^#+/, '') },
                  $unset: { sessionId: '' }
                });
              }}
            >
              <ExitToApp className={classes.leftIcon} aria-hidden="true" />
              Make Top Level Graph
            </MenuItem>
          )}
          <MenuItem
            onClick={() => {
              importGraph();
              this.handleClose();
            }}
          >
            <ImportExport className={classes.leftIcon} aria-hidden="true" />
            Import Graph from File
          </MenuItem>
          <MenuItem
            onClick={() => {
              setSidepanelOpen(false);
              this.props.openImport();
              this.handleClose();
            }}
          >
            <ImportExport className={classes.leftIcon} aria-hidden="true" />
            Import Graph from the Server
          </MenuItem>
          <MenuItem
            onClick={() => {
              exportGraph();
              this.handleClose();
            }}
          >
            <Timeline className={classes.leftIcon} aria-hidden="true" />
            Export Graph as File
          </MenuItem>
          <MenuItem
            onClick={() => {
              exportPicture();
              this.handleClose();
            }}
          >
            <Image className={classes.leftIcon} aria-hidden="true" />
            Export Graph as Image
          </MenuItem>
          <MenuItem
            onClick={() =>
              parentId
                ? loadGraphMetaData(parentId, () => {
                    this.props.openExport();
                    this.handleClose();
                  })
                : this.props.openExport()
            }
          >
            <Timeline className={classes.leftIcon} aria-hidden="true" />
            Export Graph to the Server
          </MenuItem>
          <MenuItemDeleteFromServer
            {...{ setIdRemove, parentId, setDelete, classes }}
            handleClose={this.handleClose}
          />
        </Menu>
      </div>
    );
  }
}

export const ConfigMenu = withStyles(styles)(connect(GraphActionMenu));
