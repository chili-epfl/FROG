import React from 'react';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import { Manager, Target, Popper } from 'react-popper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Undo from '@material-ui/icons/Undo';
import Add from '@material-ui/icons/Add';
import ContentCopy from '@material-ui/icons/ContentCopy';
import Delete from '@material-ui/icons/Delete';
import ImportExport from '@material-ui/icons/ImportExport';
import Image from '@material-ui/icons/Image';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Timeline from '@material-ui/icons/Timeline';
import Tooltip from '@material-ui/core/Tooltip';

import { loadGraphMetaData } from '/imports/api/remoteGraphs';

import { exportGraph, importGraph, duplicateGraph } from '../utils/export';
import { connect, store } from '../store';
import exportPicture from '../utils/exportPicture';
import { removeGraph } from '../../../api/activities';
import { addGraph, assignGraph, Graphs } from '../../../api/graphs';

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
      setDelete,
      setIdRemove,
      store: {
        graphId,
        ui: { setSidepanelOpen }
      }
    } = this.props;
    const { open } = this.state;
    const parentId = Graphs.findOne(graphId).parentId;
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
                      />Duplicate Graph
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
                      />Import Graph from File
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
                        exportGraph();
                        this.handleClose();
                      }}
                    >
                      <Timeline
                        className={classes.leftIcon}
                        aria-hidden="true"
                      />Export Graph as File
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
                      onClick={() =>
                        parentId
                          ? loadGraphMetaData(parentId, () => {
                              this.props.openExport();
                              this.handleClose();
                            })
                          : this.props.openExport()
                      }
                    >
                      <Timeline
                        className={classes.leftIcon}
                        aria-hidden="true"
                      />Export Graph to the Server
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        if (setIdRemove)
                          setIdRemove({ type: 'graph', id: parentId });
                        setDelete(true);
                        // submitRemoveGraph(graphId); DO SOMETHING
                        this.handleClose();
                      }}
                    >
                      <Delete className={classes.leftIcon} aria-hidden="true" />Remove
                      Current Graph from the Server
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

export const ConfigMenu = withStyles(styles)(connect(GraphActionMenu));
