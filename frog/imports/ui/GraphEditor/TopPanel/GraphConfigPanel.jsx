import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {ChangeableText} from 'frog-utils';
import {withStyles} from 'material-ui/styles';
import MenuItem from 'material-ui/Menu/MenuItem';
import TextField from 'material-ui/TextField';

import {connect, store} from '../store';
import {Graphs, renameGraph} from '../../../api/graphs';
import {ValidButton} from '../Validator';

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    root: {
        display: 'flex',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 100,
    },
});

@withStyles(styles)
class GraphTextComponent extends React.Component {

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    render() {
        const {classes} = this.props;
        const {graph} = this.props;
        return (
            <div className={classes.root}>
                <form className={classes.container} noValidate autoComplete="off">
                    <TextField
                        id="name"
                        className={classes.textField}
                        value={graph ? graph.name : 'untitled'}
                        onChange={e => {
                            renameGraph(graph._id, e);
                        }}
                        margin="normal"
                    />
                </form>
            </div>
        );
    }
}


const Config = ({graph}) => (
 <GraphTextComponent graph={graph}/>
);

const GraphConfigPanel = createContainer(
    props => ({...props, graph: Graphs.findOne({_id: props.graphId})}),
    Config
);

export default connect(({store: {graphId}}) => (
    <div
        className="bootstrap"
        style={{
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: 'white',
            justifyContent: 'center'
        }}
    >
        {/*<ValidButton/>*/}
        <GraphConfigPanel graphId={graphId}/>
    </div>
));
