// @flow

import * as React from 'react';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { withStyles } from '@material-ui/styles';
import Undo from '@material-ui/icons/Undo';
import Add from '@material-ui/icons/Add';
import DescriptionIcon from '@material-ui/icons/Description';
import FileCopy from '@material-ui/icons/FileCopy';
import Delete from '@material-ui/icons/Delete';
import ExitToApp from '@material-ui/icons/ExitToApp';
import ImportExport from '@material-ui/icons/ImportExport';
import Image from '@material-ui/icons/Image';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Timeline from '@material-ui/icons/Timeline';
import Tooltip from '@material-ui/core/Tooltip';
import Help from '@material-ui/icons/Help';
import TemplateModal from './TemplateModal';

import {
  addGraph,
  assignGraph,
  removeGraph,
  Graphs
} from '/imports/api/graphs';
import {
  addTemplate,
  findTemplate,
  updateTemplate,
  removeTemplate
} from '/imports/api/templates';
import { loadGraphMetaData } from '/imports/api/remoteGraphs';
import { LibraryStates } from '/imports/api/cache';
import { getUsername } from '/imports/api/users';

import {
  exportGraph,
  importGraph,
  duplicateGraph,
  graphToString
} from '/imports/api/exportGraph';
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
    padding: theme.spacing(1),
    margin: 5
  },
  helpButton: {
    padding: theme.spacing(1),
    margin: 5
  },
  button: {
    padding: theme.spacing(1)
  },
  leftIcon: {
    marginRight: theme.spacing()
  },
  rightIcon: {
    marginLeft: theme.spacing()
  }
});

const UndoButtonComponent = ({ classes, store: { undo } }) => (
  <div className={classes.root}>
    <Tooltip id="tooltip-top" title="undo the last graph action">
      <Button onClick={undo} color="primary" className={classes.undoButton}>
        UNDO
        <Undo className={classes.rightIcon} />
      </Button>
    </Tooltip>
  </div>
);

export const UndoButton = withStyles(styles)(connect(UndoButtonComponent));

const MenuItemDeleteFromServer = ({
  setIdRemove,
  parentId,
  setDelete,
  classes,
  handleClose
}) =>
  !LibraryStates.graphList.find(x => x.uuid === parentId) ||
  LibraryStates.graphList.find(x => x.uuid === parentId).owner_id ===
    getUsername() ? (
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
    openTemplateModal: false,
    anchorEl: null
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleTemplateModalOpen = () => {
    this.setState({ openTemplateModal: true });
  };

  handleTemplateModalClose = () => {
    this.setState({ openTemplateModal: false, anchorEl: null });
  };

  render() {
    const {
      classes,
      setDelete,
      setIdRemove,
      store: {
        graphId,
        templateSource,
        ui: { setSidepanelOpen, setShowHelpModal }
      }
    } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    const graph = Graphs.findOne(graphId);
    const parentId = graph?.parentId;
    const sessionId = graph?.sessionId;

    const submitTemplate = (templateName, graph) => {
      const graphObj = JSON.parse(graphToString(graph));
      addTemplate(templateName, graphObj);
      this.handleTemplateModalClose();
    };

    const template = findTemplate(templateSource);

    return (
      <>
        <div className={classes.root}>
          <TemplateModal
            open={this.state.openTemplateModal}
            callback={this.handleTemplateModalClose}
            onSubmit={submitTemplate}
            graph={graphId}
          />
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
            {template ? (
              <MenuItem
                onClick={() => {
                  const graphObj = JSON.parse(graphToString(graphId));
                  updateTemplate(templateSource, graphObj);
                  this.handleClose();
                }}
              >
                <DescriptionIcon
                  className={classes.leftIcon}
                  aria-hidden="true"
                />
                Update Template
              </MenuItem>
            ) : (
              <MenuItem
                onClick={() => {
                  this.handleTemplateModalOpen();
                  this.handleClose();
                }}
              >
                <DescriptionIcon
                  className={classes.leftIcon}
                  aria-hidden="true"
                />
                Save as Template
              </MenuItem>
            )}
            {template ? (
              <MenuItem
                onClick={() => {
                  removeTemplate(templateSource);
                  this.handleClose();
                }}
              >
                <Delete className={classes.leftIcon} aria-hidden="true" />
                Delete Template
              </MenuItem>
            ) : null}
            <MenuItem
              onClick={() => {
                duplicateGraph(store, graphId);
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
                importGraph(store);
                this.handleClose();
              }}
            >
              <ImportExport className={classes.leftIcon} aria-hidden="true" />
              Import Graph from File
            </MenuItem>
            <MenuItem
              onClick={() => {
                setSidepanelOpen(true);
                this.props.openImport();
                this.handleClose();
              }}
            >
              <ImportExport className={classes.leftIcon} aria-hidden="true" />
              Import Graph from the Server
            </MenuItem>
            <MenuItem
              onClick={() => {
                exportGraph(store);
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
            <MenuItem onClick={() => setShowHelpModal(true)}>
              <Help className={classes.leftIcon} aria-hidden="true" />
              Help
            </MenuItem>
            <MenuItemDeleteFromServer
              {...{ setIdRemove, parentId, setDelete, classes }}
              handleClose={this.handleClose}
            />
          </Menu>
        </div>
      </>
    );
  }
}

export const ConfigMenu = withStyles(styles)(connect(GraphActionMenu));
