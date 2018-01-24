import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';

import classNames from 'classnames';
import Button from 'material-ui/Button';
import {MenuItem, MenuList} from 'material-ui/Menu';
import Grow from 'material-ui/transitions/Grow';
import Paper from 'material-ui/Paper';
import {withStyles} from 'material-ui/styles';
import {Manager, Target, Popper} from 'react-popper';
import ClickAwayListener from 'material-ui/utils/ClickAwayListener';
import Check from 'material-ui-icons/Check';
import {connect, store} from '../store';
import {Graphs} from '../../../api/graphs';

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

@withStyles(styles)
class GraphListMenu extends React.Component {

    state = {
        open: false,
    };

    constructor(props) {
        super(props);
        this.selectedGraph = 'none';
    }

    handleClick = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    setSelectedGraph = (graphName) => {
        console.log('graphname:', graphName);
        this.selectedGraph = graphName;
    };

    render() {
        const {classes, graphId, graphs} = this.props;
        const {open } = this.state;

        this.selectedGraph = Graphs.findOne({ _id: graphId }).name;
        console.log('graphs', this.selectedGraph);

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
                            Select Graph: {this.selectedGraph}
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
                                        {graphs.length ? (
                                            graphs.map(graph => (
                                                <MenuItem
                                                    key={graph._id}
                                                    eventKey={graph._id}
                                                    active={graph._id === graphId}
                                                    onClick={() => {
                                                        store.setId(graph._id);
                                                        this.setSelectedGraph(graph.name);
                                                        this.handleClose();
                                                    }}
                                                >
                                                    {graphId === graph._id && (
                                                        <Check className={classes.leftIcon} aria-hidden="true"/>
                                                    )}
                                                    {graph.name}
                                                </MenuItem>
                                            ))
                                        ) : (
                                            <MenuItem eventKey="0">No graph</MenuItem>
                                        )}
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

// {graphs.length ? (
//     graphs.map(graph => (
//         <MenuItem
//             key={graph._id}
//             eventKey={graph._id}
//             active={graph._id === graphId}
//             onClick={() => store.setId(graph._id)}
//         >
//             {graphId === graph._id && (
//                 <i className="fa fa-check" aria-hidden="true" />
//             )}
//             {graph.name}
//         </MenuItem>
//     ))
// ) : (
//     <MenuItem eventKey="0">No graph</MenuItem>
// )}

const GraphMenuSimple = connect(({store: {graphId}, graphs}) => (
    <GraphListMenu graphId={graphId} graphs={graphs}/>));

const toExport = createContainer(
    props => ({...props, graphs: Graphs.find().fetch()}),
    GraphMenuSimple
);
toExport.displayName = 'GraphMenuSimple';

export default toExport;
