// @flow

import * as React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import { withStyles } from '@material-ui/styles';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Tooltip from '@material-ui/core/Tooltip';
import Edit from '@material-ui/icons/Edit';

import { Graphs, renameGraph } from '/imports/api/graphs';

import { ValidButton } from '../Validator';
import { connect, store } from '../store';

const styles = theme => ({
  root: {
    display: 'flex',
    minWidth: 0,
    flexGrow: 1,
    marginRight: 10,
    whiteSpace: 'nowrap'
  },
  formContainer: {
    marginRight: 10
  },
  button: {
    marginTop: theme.spacing(0.5),
    padding: 3,
    width: 35
  },
  textField: {
    marginTop: theme.spacing(),
    paddingRight: 0,
    width: 200
  },
  validatorContainer: {
    width: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  durationTextField: {
    marginTop: theme.spacing(),
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

const Duration = withStyles(styles)(
  ({
    duration,
    editState,
    onDurationChange,
    onDurationSubmit,
    classes
  }: DurationPropsT) => (
    <form
      onSubmit={onDurationSubmit}
      noValidate
      autoComplete="off"
      className={classes.formContainer}
    >
      <TextField
        autoFocus
        className={classes.durationTextField}
        value={duration}
        onChange={onDurationChange}
        disabled={!editState}
        InputProps={{
          endAdornment: <InputAdornment position="end">min</InputAdornment>
        }}
      />
      <Tooltip id="tooltip-top" title="edit graph duration" placement="top">
        <IconButton
          className={classes.button}
          color={editState ? 'secondary' : 'primary'}
          aria-label="Edit"
          onClick={e => onDurationSubmit(e)}
        >
          <Edit />
        </IconButton>
      </Tooltip>
    </form>
  )
);

type GraphNameSelectorPropsT = {
  graphList: Object[],
  name: string,
  graphId: string,
  editState: boolean,
  onRename: Function,
  onRenameSubmit: Function,
  onMenuChange: Function,
  classes: Object
};

const GraphNameSelector = withStyles(styles)(
  ({
    graphList,
    name,
    graphId,
    editState,
    onRename,
    onRenameSubmit,
    onMenuChange,
    classes
  }: GraphNameSelectorPropsT) => (
    <form
      onSubmit={onRenameSubmit}
      noValidate
      autoComplete="off"
      className={classes.formContainer}
    >
      {editState ? (
        <TextField
          autoFocus
          id="edit-graph"
          className={classes.textField}
          value={name}
          onChange={onRename}
        />
      ) : (
        <TextField
          id="select-graph"
          select
          value={graphId}
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
              <option key={g._id} data-key={g._id} value={g._id}>
                {g.name}
              </option>
            ))
          ) : (
            <option>No graph</option>
          )}
        </TextField>
      )}
      <Tooltip id="tooltip-top" title="edit graph name" placement="top">
        <IconButton
          className={classes.button}
          color={editState ? 'secondary' : 'primary'}
          aria-label="Edit"
          onClick={e => onRenameSubmit(e)}
        >
          <Edit />
        </IconButton>
      </Tooltip>
    </form>
  )
);

type PropsT = {
  graphId: string,
  graphs: Object,
  classes: Object
};

type StateT = {
  isEditingName: boolean,
  isEditingDuration: boolean,
  name: string,
  duration: number,
  selectedGraph: Object
};

class GraphMenu extends React.Component<PropsT, StateT> {
  constructor(props) {
    super(props);
    const { graphs, graphId } = this.props;
    const selectedGraph = graphs.find(g => g._id === graphId);
    this.state = {
      isEditingName: false,
      isEditingDuration: false,
      name: selectedGraph ? selectedGraph.name : 'untitled',
      duration: selectedGraph ? selectedGraph.duration : 30,
      selectedGraph
    };
  }

  handleMenuChange = e => {
    const selectedIndex = e.target.options.selectedIndex;
    const graphId = e.target.options[selectedIndex].getAttribute('data-key');
    store.setId(graphId);

    const selectedGraph = this.props.graphs.find(g => g._id === graphId);
    const { name, duration } = selectedGraph;
    this.setState({ name, duration, selectedGraph });
  };

  handleRename = e => {
    e.preventDefault();
    this.setState({
      name: e.target.value
    });
  };

  handleRenameSubmit = e => {
    e.preventDefault();
    const { isEditingName, selectedGraph, name } = this.state;
    if (isEditingName) {
      renameGraph(selectedGraph._id, name);
    }
    this.setState({ isEditingName: !isEditingName });
  };

  handleDurationChange = e => {
    e.preventDefault();
    this.setState({
      duration: e.target.value
    });
  };

  handleDurationSubmit = e => {
    e.preventDefault();
    const { isEditingDuration, duration } = this.state;
    if (isEditingDuration) {
      store.changeDuration(parseInt(duration, 10));
    }
    this.setState({ isEditingDuration: !isEditingDuration });
  };

  static getDerivedStateFromProps(props, state) {
    if (props.graphId !== state.selectedGraph._id) {
      const selectedGraph = props.graphs.find(g => g._id === props.graphId);
      if (selectedGraph) {
        const { name, duration } = selectedGraph;
        return { name, duration, selectedGraph };
      }
      return { name: '', duration: 0, selectedGraph: {} };
    }
    return null;
  }

  render() {
    const { classes, graphs } = this.props;
    return (
      <div className={classes.root}>
        <GraphNameSelector
          name={this.state.name}
          graphId={this.state.selectedGraph._id}
          editState={this.state.isEditingName}
          graphList={graphs}
          onRename={this.handleRename}
          onRenameSubmit={this.handleRenameSubmit}
          onMenuChange={this.handleMenuChange}
        />
        <Duration
          duration={this.state.duration}
          editState={this.state.isEditingDuration}
          onDurationChange={this.handleDurationChange}
          onDurationSubmit={this.handleDurationSubmit}
        />
        <div className={classes.validatorContainer}>
          <ValidButton />
        </div>
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
  graphs: Graphs.find({}).fetch()
}))(GraphMenuController);

toExport.displayName = 'GraphMenuSimple';
export default toExport;
