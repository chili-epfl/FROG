// @flow
import React, { Component } from 'react';
import { type ActivityPackageT, type ActivityDbT } from 'frog-utils';
import { activityTypes } from '/imports/activityTypes';
import { addActivity } from '/imports/api/activities';
import jsonSchemaDefaults from 'json-schema-defaults';
import ReactTooltip from 'react-tooltip';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import { withStyles } from '@material-ui/core/styles';
import Search from '@material-ui/icons/Search';
import Cloud from '@material-ui/icons/Cloud';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Collapse from '@material-ui/core/Collapse';
import { connect } from '../../store';
import Library from '../../RemoteControllers/RemoteLibrary';

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
  whiteList?: string[],
  categories?: string[],
  activityMapping?: Object,
  allOpen?: boolean
};

const styles = {
  topPanel: {
    padding: '10px',
    margin: 8
  },
  activityList: {
    overflowY: 'auto'
  },
  searchContainer: {
    marginRight: '8px'
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
  Category: {
    fontSize: '1.5rem',
    fontWeight: 500
  },
  List: {
    paddingTop: 5,
    paddingBottom: 5
  },
  Library: {
    marginRight: 8
  }
};

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
          <ListItemText
            primary={name}
            classes={{ primary: classes.Category }}
          />
          {this.state.open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={this.state.open} timeout="auto" unmountOnExit>
          <List>
            {items.map((x: ActivityPackageT) => (
              <ListItem
                button
                key={x.id}
                onClick={() => this.props.onSelect(x)}
                classes={{ button: classes.List }}
              >
                <ListItemText
                  inset
                  primary={x.meta.name}
                  data-tip
                  data-for={x.meta.name}
                />
                {x.meta.shortDesc && (
                  <ReactTooltip place="top" delayShow={500} id={x.meta.name}>
                    {x.meta.shortDesc}
                  </ReactTooltip>
                )}
              </ListItem>
            ))}
          </List>
        </Collapse>
      </>
    );
  }
}
const StyledActivityCategory = withStyles(styles)(ActivityCategory);
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
    const categories = this.props.categories
      ? this.props.categories
      : [
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

    const { classes, store, allOpen, activityMapping } = this.props;
    const defaultDisplay = (
      items: string[],
      categoryName: string,
      idx: number
    ) => (
      <StyledActivityCategory
        name={categoryName}
        items={items}
        defaultState={idx === 0 || idx === 1 || allOpen}
        onSelect={select}
        key={categoryName}
      />
    );
    return (
      <Grid>
        <div className={classes.topPanel}>
          <Grid item>
            <Typography variant="h4">Select Activity Type</Typography>
          </Grid>
          <Grid container spacing={16} alignItems="flex-end" item>
            <Grid item>
              <Search fontSize="inherit" />
            </Grid>
            <Grid item className={classes.searchContainer}>
              <TextField
                id="search-input"
                label="Search"
                onChange={(x: Object) => this.handleSearch(x)}
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color={!store.ui.libraryOpen ? 'primary' : 'secondary'}
                onClick={this.handleToggle}
              >
                <Cloud className={classes.Library} />
                Library
              </Button>
            </Grid>
          </Grid>
        </div>
        <List component="nav">
          {!this.props.store.ui.libraryOpen &&
            this.state.searchStr === '' &&
            categories.map((x: string, idx: number) => {
              if (activityMapping)
                return defaultDisplay(
                  filteredList.filter(y => activityMapping[y.id] === x),
                  x,
                  idx
                );
              else
                return defaultDisplay(
                  filteredList.filter(y => y.meta.category === x),
                  x,
                  idx
                );
            })}
          {!this.props.store.ui.libraryOpen &&
            this.state.searchStr !== '' &&
            filteredList.length !== 0 &&
            filteredList.map(x => (
              <ListItem
                button
                key={x.id}
                onClick={() => select(x)}
                classes={{ button: classes.List }}
              >
                {x.meta.shortDesc && (
                  <ReactTooltip place="top" delayShow={500} id={x.meta.name}>
                    {x.meta.shortDesc}
                  </ReactTooltip>
                )}
                <ListItemText inset primary={x.meta.name} />
              </ListItem>
            ))}
          {!this.props.store.ui.libraryOpen &&
            this.state.searchStr !== '' &&
            filteredList.length === 0 && (
              <ListItem key="no-match-search">
                <ListItemText
                  inset
                  primary="No Activity types matched your search"
                />
              </ListItem>
            )}
          {this.props.store.ui.libraryOpen && (
            <Library
              key="library"
              libraryType="activity"
              setDelete={this.props.setDelete}
              setIdRemove={this.props.setIdRemove}
              activityId={this.props.activity._id}
              setActivityTypeId={this.props.setActivityTypeId}
              store={this.props.store}
              locallyChanged={this.props.locallyChanged}
              changesLoaded={this.props.changesLoaded}
              onSelect={this.props.onSelect}
              searchStr={this.state.searchStr}
            />
          )}
        </List>
      </Grid>
    );
  }
}

const ChooseActivityConnected = connect(ChooseActivityTypeController);

export default withStyles(styles)(ChooseActivityConnected);
