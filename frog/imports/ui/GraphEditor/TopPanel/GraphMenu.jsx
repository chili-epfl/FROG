// @flow

import * as React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import { withStyles } from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';
import ModeEdit from 'material-ui-icons/ModeEdit';
import TextField from 'material-ui/TextField';
import Input, { InputAdornment } from 'material-ui/Input';
import Tooltip from 'material-ui/Tooltip';

import { ValidButton } from '../Validator';
import { connect, store } from '../store';
import { Graphs, renameGraph } from '../../../api/graphs';

const styles = theme => ({
  root: {
    display: 'flex',
    minWidth: 0,
    flexGrow: 1,
    whiteSpace: 'nowrap'
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
  validButton: {
    backgroundColor: 'gray',
    width: 50
  },
  durationTextField: {
    marginTop: theme.spacing.unit,
    backgroundColor: 'white',
    paddingRight: 0,
    width: 65
  }
});

type DurationPropsT = {
  duration: number,
  editState: boolean,
  onDurationChange: Function,
  onDurationSubmit: Function,
  classes: Object
};

@withStyles(styles)
class Duration extends React.Component<DurationPropsT, {}> {
  render() {
    const {
      duration,
      editState,
      onDurationChange,
      onDurationSubmit,
      classes
    } = this.props;
    return (
      <form
        onSubmit={onDurationSubmit}
        className={classes.root}
        noValidate
        autoComplete="off"
      >
        <div className={classes.root}>
          <div className={classes.basic}>
            <Input
              autoFocus
              id="adornment-duration"
              className={classes.durationTextField}
              value={duration}
              onChange={onDurationChange}
              disabled={!editState}
              endAdornment={<InputAdornment position="end">min</InputAdornment>}
            />
          </div>

          <div className={classes.basic}>
            <Tooltip
              id="tooltip-top"
              title="edit graph duration"
              placement="top"
            >
              <IconButton
                className={classes.button}
                color={editState ? 'secondary' : 'primary'}
                aria-label="Edit"
                onClick={e => onDurationSubmit(e)}
              >
                <ModeEdit />
              </IconButton>
            </Tooltip>

            <ValidButton />
          </div>
        </div>
      </form>
    );
  }
}

type GraphSubPropsT = {
  graphList: Object[],
  name: string,
  editState: boolean,
  onRename: Function,
  onRenameSubmit: Function,
  onMenuChange: Function,
  classes: Object
};

@withStyles(styles)
class GraphSubComponent extends React.Component<GraphSubPropsT, {}> {
  render() {
    const {
      graphList,
      name,
      editState,
      onRename,
      onRenameSubmit,
      onMenuChange,
      classes
    } = this.props;

    return (
      <form
        onSubmit={onRenameSubmit}
        className={classes.root}
        noValidate
        autoComplete="off"
      >
        {editState ? (
          <div className={classes.basic}>
            <TextField
              autoFocus
              id="edit-graph"
              className={classes.textField}
              value={name}
              onChange={onRename}
            />
          </div>
        ) : (
          <div className={classes.basic}>
            <TextField
              id="select-graph"
              select
              value={name}
              className={classes.textField}
              onChange={onMenuChange}
              SelectProps={{
                native: true,
                MenuProps: {
                  className: classes.menu
                }
              }}
            >
              {graphList.length ? (
                graphList.map(g => (
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
              color={editState ? 'secondary' : 'primary'}
              aria-label="Edit"
              onClick={e => onRenameSubmit(e)}
            >
              <ModeEdit />
            </IconButton>
          </Tooltip>
        </div>
      </form>
    );
  }
}

type PropsT = {
  graphId: string,
  graphs: Object,
  classes: Object
};

type StateT = {
  isEditingName: boolean,
  isEditingDuration: boolean,
  name: string,
  duration: number
};

class GraphMenu extends React.Component<PropsT, StateT> {
  selectedGraph: Object;

  constructor(props) {
    super(props);
    this.selectedGraph = Graphs.findOne({ _id: this.props.graphId });
    this.state = {
      isEditingName: false,
      isEditingDuration: false,
      name: this.selectedGraph ? this.selectedGraph.name : 'untitled',
      duration: this.selectedGraph ? this.selectedGraph.duration : 30
    };
  }

  handleMenuChange = e => {
    const selectedIndex = e.target.options.selectedIndex;
    const graphId = e.target.options[selectedIndex].getAttribute('data-key');
    store.setId(graphId);

    this.selectedGraph = Graphs.findOne({ _id: graphId });

    this.setState({
      name: this.selectedGraph.name,
      duration: this.selectedGraph.duration
    });
  };

  handleRename = e => {
    e.preventDefault();
    this.setState({
      name: e.target.value
    });
  };

  handleRenameSubmit = e => {
    e.preventDefault();
    if (this.state.isEditingName) {
      renameGraph(this.selectedGraph._id, this.state.name);
    }
    this.setState({ isEditingName: !this.state.isEditingName });
  };

  handleDurationChange = e => {
    e.preventDefault();
    this.setState({
      duration: e.target.value
    });
  };

  handleDurationSubmit = e => {
    e.preventDefault();
    if (this.state.isEditingDuration) {
      store.changeDuration(parseInt(this.state.duration, 10));
    }
    this.setState({ isEditingDuration: !this.state.isEditingDuration });
  };

  render() {
    const { classes, graphs } = this.props;

    return (
      <div className={classes.root}>
        <GraphSubComponent
          name={this.state.name}
          editState={this.state.isEditingName}
          graphList={graphs}
          onRename={this.handleRename}
          onRenameSubmit={this.handleRenameSubmit}
          onMenuChange={this.handleMenuChange}
        />
        <div className={classes.spacer} />
        <Duration
          duration={this.state.duration}
          editState={this.state.isEditingDuration}
          onDurationChange={this.handleDurationChange}
          onDurationSubmit={this.handleDurationSubmit}
        />
      </div>
    );
  }
}
const StyledGraphMenu = withStyles(styles)(GraphMenu);

const GraphMenuController = connect(({ store: { graphId }, graphs }) => (
  <StyledGraphMenu graphId={graphId} graphs={graphs} />
));

const toExport = withTracker(props => ({
  ...props,
  graphs: Graphs.find().fetch()
}))(GraphMenuController);

toExport.displayName = 'GraphMenuSimple';
export default toExport;
