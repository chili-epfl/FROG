import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { withStyles } from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';
import ModeEdit from 'material-ui-icons/ModeEdit';
import TextField from 'material-ui/TextField';
import Input, { InputAdornment } from 'material-ui/Input';
import Tooltip from 'material-ui/Tooltip';

import { connect, store } from '../store';
import { Graphs, renameGraph } from '../../../api/graphs';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  basic: {
    backgroundColor: 'white'
  },
  button: {
    marginTop: theme.spacing.unit / 2,
    padding: 3,
    width: 35
  },
  textField: {
    marginTop: theme.spacing.unit,
    backgroundColor: 'white',
    paddingRight: 0,
    width: 200
  },
  spacer: {
    backgroundColor: 'gray',
    width: 50,
    height: 1
  },
  durationTextField: {
    marginTop: theme.spacing.unit,
    backgroundColor: 'white',
    paddingRight: 0,
    width: 65
  }
});

@withStyles(styles)
class GraphListMenu extends React.Component {
  state = {
    isEditingName: false,
    isEditingDuration: false,
    name: '',
    duration: ''
  };

  constructor(props) {
    super(props);
    const { graphId } = this.props;
    this.selectedGraph = Graphs.findOne({ _id: graphId });
    this.state = {
      name: this.selectedGraph ? this.selectedGraph.name : 'untitled',
      duration: this.selectedGraph ? this.selectedGraph.duration : 30
    };
  }

  handleNameChange = e => {
    e.preventDefault();
    this.setState({
      name: e.target.value
    });
  };

  handleMenuChange = e => {
    const selectedIndex = e.target.options.selectedIndex;
    const graphId = e.target.options[selectedIndex].getAttribute('data-key');
    this.selectedGraph = Graphs.findOne({ _id: graphId });
    store.setId(graphId);
    this.setState({
      name: this.selectedGraph.name,
      duration: this.selectedGraph.duration
    });
  };

  handleDurationChange = e => {
    e.preventDefault();
    this.setState({
      duration: e.target.value
    });
  };

  handleGraphNameSubmit = e => {
    e.preventDefault();
    if (this.state.isEditingName) {
      renameGraph(this.selectedGraph._id, this.state.name);
    }
    this.setState({ isEditingName: !this.state.isEditingName });
  };

  handleGraphDurationSubmit = e => {
    e.preventDefault();
    if (this.state.isEditingDuration) {
      store.changeDuration(parseInt(this.state.duration, 10));
    }
    this.setState({ isEditingDuration: !this.state.isEditingDuration });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        {this.renderGraphSubComponent()}
        <div className={classes.spacer} />
        {this.renderDurationSubComponent()}
      </div>
    );
  }

  renderDurationSubComponent() {
    const { classes } = this.props;
    const { isEditingDuration } = this.state;

    return (
      <form
        onSubmit={this.handleGraphDurationSubmit}
        className={classes.root}
        noValidate
        autoComplete="off"
      >
        <div className={classes.basic}>
          <Input
            autoFocus
            id="adornment-duration"
            className={classes.durationTextField}
            value={this.state.duration}
            onChange={this.handleDurationChange}
            margin="normal"
            disabled={!isEditingDuration}
            endAdornment={
              <InputAdornment margin="none" position="end">
                min
              </InputAdornment>
            }
          />
        </div>
        <div className={classes.basic}>
          <Tooltip id="tooltip-top" title="edit graph duration" placement="top">
            <IconButton
              className={classes.button}
              color={isEditingDuration ? 'accent' : 'primary'}
              aria-label="Edit"
              onClick={e => {
                this.handleGraphDurationSubmit(e);
              }}
            >
              <ModeEdit />
            </IconButton>
          </Tooltip>
        </div>
      </form>
    );
  }

  renderGraphSubComponent() {
    const { classes, graphId, graphs } = this.props;
    const { isEditingName } = this.state;
    this.selectedGraph = Graphs.findOne({ _id: graphId });

    return (
      <form
        onSubmit={this.handleGraphNameSubmit}
        className={classes.root}
        noValidate
        autoComplete="off"
      >
        {isEditingName ? (
          <div className={classes.basic}>
            <TextField
              autoFocus
              id="edit-graph"
              className={classes.textField}
              value={this.state.name}
              onChange={this.handleNameChange}
            />
          </div>
        ) : (
          <div className={classes.basic}>
            <TextField
              id="select-graph"
              select
              value={this.selectedGraph.name}
              className={classes.textField}
              onChange={this.handleMenuChange}
              SelectProps={{
                native: true,
                MenuProps: {
                  className: classes.menu
                }
              }}
            >
              {graphs.length ? (
                graphs.map(g => (
                  <option key={g._id} data-key={g._id} value={g.name}>
                    {g.name}
                  </option>
                ))
              ) : (
                <option>No graph</option>
              )}
            </TextField>
          </div>
        )}
        <div className={classes.basic}>
          <Tooltip id="tooltip-top" title="edit graph name" placement="top">
            <IconButton
              className={classes.button}
              color={isEditingName ? 'accent' : 'primary'}
              aria-label="Edit"
              onClick={e => {
                this.handleGraphNameSubmit(e);
              }}
            >
              <ModeEdit />
            </IconButton>
          </Tooltip>
        </div>
      </form>
    );
  }
}

const GraphMenuSimple = connect(({ store: { graphId }, graphs }) => (
  <GraphListMenu graphId={graphId} graphs={graphs} />
));

const toExport = createContainer(
  props => ({ ...props, graphs: Graphs.find().fetch() }),
  GraphMenuSimple
);
toExport.displayName = 'GraphMenuSimple';

export default toExport;
