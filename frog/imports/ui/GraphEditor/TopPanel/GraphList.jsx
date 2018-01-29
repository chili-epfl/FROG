import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';

import classNames from 'classnames';

import {withStyles} from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';
import ModeEdit from 'material-ui-icons/ModeEdit';

import MenuItem from 'material-ui/Menu/MenuItem';
import TextField from 'material-ui/TextField';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Visibility from 'material-ui-icons/Visibility';
import VisibilityOff from 'material-ui-icons/VisibilityOff';

import {connect, store} from '../store';
import {Graphs, renameGraph} from '../../../api/graphs';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    button: {
        margin: theme.spacing.unit / 2,
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    textField: {
        margin: theme.spacing.unit,
        backgroundColor: 'white',
        width: 200,
    },
});

@withStyles(styles)
class GraphListMenu extends React.Component {

    state = {
        isEditing: false,
        name: "",
    };

    constructor(props) {
        super(props);
        const {classes, graphId, graphs} = this.props;
        const {isEditing} = this.state;
        this.selectedGraph = Graphs.findOne({_id: graphId});
        this.state = {
            name: this.selectedGraph.name
        };

    }

    handleChange = (event) => {


        this.setState({
            name: event.target.value,
        });
        console.log('CHNAGE: ', event.target.value);
    };

    handleClick = (e) => {
        console.log('value',e.target.value);
        if(this.state.isEditing) {
            renameGraph(this.selectedGraph._id, this.state.name);
        }
        this.setState({isEditing: !this.state.isEditing});
        console.log('renamed: ', this.state.name);
    };

    setSelectedGraph = (graph) => {
        this.selectedGraph = graph;
        this.setState({
            name: this.selectedGraph.name,
        });
    };

    render() {

        const {classes} = this.props;

        return (
            <div className={classes.root}>
                {this.renderGraphSubComponent()}
            </div>
        );
    }

    renderGraphSubComponent() {

        const {classes, graphId, graphs} = this.props;
        const {isEditing} = this.state;
        this.selectedGraph = Graphs.findOne({_id: graphId});


            this.state.name = this.selectedGraph.name;
            console.log('graph', this.state.name, this.selectedGraph.name );

        return (
            <form className={classes.root} noValidate autoComplete="off">
                {isEditing ?
                    (
                        <TextField
                            autoFocus
                            id="edit-graph"
                            className={classes.textField}
                            value={this.state.name}
                            onChange={this.handleChange}
                        />
                    ) : (
                        <TextField
                            id="select-graph"
                            select
                            value={this.selectedGraph.name}
                            className={classes.textField}
                            SelectProps={{
                                native: true,
                                MenuProps: {
                                    className: classes.menu,
                                },
                            }}
                        >
                            {graphs.length ? (
                                graphs.map(g => (
                                    <option
                                        key={g._id}
                                        value={g.name}
                                        // active={String(g._id === graphId)}
                                        onClick={() => {
                                            store.setId(g._id);
                                            this.setSelectedGraph(g);
                                            this.handleClose();
                                        }}
                                    >
                                        {g.name}
                                    </option>
                                ))
                            ) : (
                                <MenuItem>No graph</MenuItem>
                            )}

                        </TextField>
                    )
                }
                <IconButton
                    className={classes.button}
                    color={isEditing ? "accent" : "primary"}
                    aria-label="Edit"
                    onClick={e => {
                        if (isEditing) {
                            console.log('editing', isEditing, this.selectedGraph);
                            this.handleClick(e);
                        }
                        this.handleClick(e);
                    }}>
                    <ModeEdit/>
                </IconButton>
            </form>);
    };
}

const GraphMenuSimple = connect(({store: {graphId}, graphs}) => (
    <GraphListMenu graphId={graphId} graphs={graphs}/>));

const toExport = createContainer(
    props => ({...props, graphs: Graphs.find().fetch()}),
    GraphMenuSimple
);
toExport.displayName = 'GraphMenuSimple';

export default toExport;
