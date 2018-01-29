import React from 'react';
import classNames from 'classnames';
import Button from 'material-ui/Button';
import {MenuItem, MenuList} from 'material-ui/Menu';
import Grow from 'material-ui/transitions/Grow';
import Paper from 'material-ui/Paper';
import {withStyles} from 'material-ui/styles';
import {Manager, Target, Popper} from 'react-popper';
import ClickAwayListener from 'material-ui/utils/ClickAwayListener';
import Undo from 'material-ui-icons/Undo';
import Check from 'material-ui-icons/Check';


import {exportGraph, importGraph, duplicateGraph} from '../utils/export';
import {connect, store} from '../store';
import exportPicture from '../utils/exportPicture';
import {removeGraph} from '../../../api/activities';
import {addGraph, assignGraph} from '../../../api/graphs';

const submitRemoveGraph = id => {
    removeGraph(id);
    store.setId(assignGraph());
};

const styles = theme => ({
    root: {
        display: 'flex',
    },
    popperClose: {
        pointerEvents: 'none',
    },
    button: {
        margin: theme.spacing.unit / 2,
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
});

export const UndoButton = connect(({store: {undo}}) => (
    <UndoButtonComponent undo={undo}/>
));

@withStyles(styles)
class UndoButtonComponent extends React.Component {

    render() {
        const {classes, undo} = this.props;
        return (
            <div className={classes.root}>
                <Button
                    onClick={undo}
                    color="primary"
                    className={classes.button}
                >
                    <Undo className={classes.leftIcon}/>
                    UNDO
                </Button>
            </div>
        );
    }
}

@withStyles(styles)
class GraphActionMenu extends React.Component {
    state = {
        open: false,
    };

    handleClick = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    render() {
        const {classes, overlapAllowed, graphId, toggleOverlapAllowed} = this.props;
        const {open} = this.state;

        return (
            <div className={classes.root}>
                <Manager>
                    <Target>
                        <Button
                            aria-owns={open ? 'menu-list' : null}
                            aria-haspopup="true"
                            onClick={this.handleClick}
                            color="primary"
                            className={classes.button}
                        >
                            Graph Actions
                        </Button>
                    </Target>
                    <Popper
                        placement="bottom-start"
                        eventsEnabled={open}
                        className={classNames({[classes.popperClose]: !open})}
                    >
                        <ClickAwayListener onClickAway={this.handleClose}>
                            <Grow in={open} id="menu-list" style={{transformOrigin: '0 0 0'}}>
                                <Paper>
                                    <MenuList role="menu">
                                        <MenuItem onClick={() => {
                                            toggleOverlapAllowed();
                                            this.handleClose();
                                        }}>{overlapAllowed && <Check className={classes.leftIcon} aria-hidden="true"/>}Overlap
                                            Allowed</MenuItem>
                                        <MenuItem onClick={() => {
                                            store.setId(addGraph());
                                            this.handleClose();
                                        }}>Add New Graph</MenuItem>
                                        <MenuItem onClick={() => {
                                            duplicateGraph(graphId);
                                            this.handleClose()
                                        }}>Copy Graph</MenuItem>
                                        <MenuItem onClick={() => {
                                            submitRemoveGraph(graphId);
                                            this.handleClose()
                                        }}>Delete Current Graph</MenuItem>
                                        <MenuItem onClick={() => {
                                            importGraph();
                                            this.handleClose()
                                        }}>Import Graph</MenuItem>
                                        <MenuItem onClick={() => {
                                            exportGraph();
                                            this.handleClose()
                                        }}>Export Graph</MenuItem>
                                        <MenuItem onClick={() => {
                                            exportPicture();
                                            this.handleClose()
                                        }}>Export Graph as Image</MenuItem>
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
    ({store: {overlapAllowed, graphId, toggleOverlapAllowed}}) => (
        <GraphActionMenu overlapAllowed={overlapAllowed} graphId={graphId}
                         toggleOverlapAllowed={toggleOverlapAllowed}/>)
);