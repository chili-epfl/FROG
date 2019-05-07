// @flow
import React, { Component } from 'react';
import { type ActivityPackageT, type ActivityDbT } from 'frog-utils';
import { activityTypes } from '/imports/activityTypes';
import { addActivity } from '/imports/api/activities';
import jsonSchemaDefaults from 'json-schema-defaults';

import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import { withStyles } from '@material-ui/core/styles';
import Search from '@material-ui/icons/Search';
import Cloud from '@material-ui/icons/Cloud';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import StarBorder from '@material-ui/icons/StarBorder';
import Collapse from '@material-ui/core/Collapse';
import { connect } from '../../store';
import Library from '../../RemoteControllers/RemoteLibrary';
import ListComponent from '../ListComponent';
import Preview from '../../../Preview';

type StateT = {
  expanded: ?string,
  searchStr: string,
  showInfo: ?string
};
type PropsT = {
  classes: Object,
  store?: Object,
  hidePreview?: boolean,
  onSelect?: Function,
  onPreview?: Function,
  activity: ActivityDbT,
  setDelete?: Function,
  setIdRemove?: Function,
  onlyHasPreview?: boolean,
  locallyChanged?: boolean,
  changesLoaded?: Function,
  setActivityTypeId?: Function,
  hideLibrary?: boolean,
  whiteList?: string[]
};

const styles = {
  topPanel: {
    padding: '10px'
  },
  activityList: {
    height: 'calc(100vh - 112px - 100px)',
    overflowY: 'auto'
  },
  searchContainer: {
    position: 'relative',
    borderRadius: '5px',
    background: 'rgba(0,0,0,.05)'
  },
  searchIcon: {
    width: '50px',
    height: '100%',
    display: 'flex',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  },
  searchInput: {
    border: '0',
    width: '100%',
    padding: '8px 8px 8px 50px',
    background: 'none',
    outline: 'none',
    whiteSpace: 'normal',
    verticalAlign: 'middle',
    fontSize: '1rem'
  },
  centerButton: {
    textAlign: 'center'
  },
  cloudIcon: {
    marginRight: '8px',
    fontSize: 20
  },
  resultContainer: {
    height: '100%'
  },
  Tooltip: {
    backgroundColor: '#FFF',
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow:
      '0px 1px 3px 0px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 2px 1px -1px rgba(0,0,0,0.12)',
    fontSize: '1rem'
  },
  searchBox: {
    margin: 8
  }
};

const NoResult = ({ classes }) => (
  <Grid
    container
    justify="center"
    alignItems="center"
    className={classes.resultContainer}
  >
    <Grid item>
      <Typography variant="body1">No results found</Typography>
    </Grid>
  </Grid>
);

const StyledNoResult = withStyles(styles)(NoResult);

const ChooseActivityTopPanel = connect(
  ({ classes, onSearch, onToggle, store, hideLibrary }) => (
    <Grid
      container
      className={classes.topPanel}
      alignItems="center"
      spacing={8}
    >
      <Grid item xs={12}>
        <Typography variant="h6">Select activity type</Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container justify="center">
          <Grid item xs={8}>
            <div className={classes.searchContainer}>
              <div className={classes.searchIcon}>
                <Search />
              </div>
              <input
                type="text"
                onChange={onSearch}
                className={classes.searchInput}
                aria-describedby="basic-addon1"
              />
            </div>
          </Grid>
          {!hideLibrary && (
            <Grid item xs={4} className={classes.centerButton}>
              <Button
                color="primary"
                size="small"
                variant={store.ui.libraryOpen ? 'contained' : null}
                onClick={onToggle}
              >
                <Cloud className={classes.cloudIcon} /> Library
              </Button>
            </Grid>
          )}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
    </Grid>
  )
);

const StyledChooseActivityTopPanel = withStyles(styles)(ChooseActivityTopPanel);

class ActivityCategory extends Component<any, any> {
  state = {
    open: this.props.defaultState
  };
  handleClick = () => {
    this.setState({ open: !this.state.open });
  };
  render() {
    const { name, items, classes } = this.props;
    return (
      <>
        <ListItem button onClick={this.handleClick} key={name}>
          <ListItemIcon>
            <StarBorder />
          </ListItemIcon>
          <ListItemText inset primary={name} />
          {this.state.open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={this.state.open} timeout="auto" unmountOnExit>
          <List>
            {items.map((x: ActivityPackageT) => (
              <ListItem
                button
                key={x.id}
                onClick={() => this.props.onSelect(x)}
              >
                <Tooltip
                  title={x.meta.shortDesc}
                  classes={{ tooltip: classes.Tooltip }}
                  placement="right"
                  interactive
                >
                  <ListItemText inset primary={x.meta.name} />
                </Tooltip>
              </ListItem>
            ))}
          </List>
        </Collapse>
      </>
    );
  }
}
ActivityCategory = withStyles(styles)(ActivityCategory);
class ChooseActivityTypeController extends Component<PropsT, StateT> {
  inputRef: any;

  constructor(props: PropsT) {
    super(props);
    this.state = {
      expanded: null,
      searchStr: '',
      showInfo: null
    };
    this.inputRef = null;
  }

  handleToggle = () => {
    if (this.props.store) {
      this.props.store.ui.setLibraryOpen(!this.props.store.ui.libraryOpen);
    }
  };

  handleSearch = e => {
    this.setState({
      expanded: null,
      searchStr: e.target.value.toLowerCase()
    });
  };

  render() {
    const whiteList = this.props.whiteList;
    const types = whiteList
      ? activityTypes.filter(x => whiteList.includes(x.id))
      : activityTypes;
    const activityTypesFiltered = this.props.onlyHasPreview
      ? types.filter(x => x.meta.exampleData !== undefined)
      : types;

    const select = this.props.onSelect
      ? this.props.onSelect
      : aT => {
          const defaultConf = jsonSchemaDefaults(aT.config);
          addActivity(aT.id, defaultConf, this.props.activity._id);
          const { store, activity } = this.props;
          if (store) {
            if (activity.title && activity.title === 'Unnamed') {
              const graphActivity = store.activityStore.all.find(
                act => act.id === activity._id
              );
              const newName = aT.meta.shortName || aT.meta.name;
              graphActivity.rename(newName);
            }
            store.addHistory();
          }
        };
    const categories = [
      'Core tools',
      'Single Learning Items',
      'Discipline-specific',
      'Simulations',
      'Deprecated core tools',
      'Hyper-specific'
    ];
    const filteredList = activityTypesFiltered
      .filter(
        x =>
          x.meta.name.toLowerCase().includes(this.state.searchStr) ||
          (x.meta.shortDesc &&
            x.meta.shortDesc.toLowerCase().includes(this.state.searchStr)) ||
          x.meta.description.toLowerCase().includes(this.state.searchStr)
      )
      .sort((x: Object, y: Object) => (x.meta.name < y.meta.name ? -1 : 1));
    const closeLibrary = () =>
      this.props.store && this.props.store.ui.setLibraryOpen(false);

    const { classes } = this.props;
    return (
      <Grid>
        <div className={classes.searchBox}>
          <Grid container spacing={8} alignItems="flex-end" item>
            <Grid item>
              <Search fontSize="inherit" />
            </Grid>
            <Grid item>
              <TextField id="search-input" label="Search" />
            </Grid>
          </Grid>
        </div>
        <List component="nav">
          {categories.map((x: string, idx: number) => (
            <ActivityCategory
              name={x}
              items={filteredList.filter(y => y.meta.category == x)}
              defaultState={idx == 0 || idx == 1}
              onSelect={select}
            />
          ))}
        </List>
      </Grid>
    );
  }
}

const ChooseActivityConnected = connect(ChooseActivityTypeController);

export default withStyles(styles)(ChooseActivityConnected);
