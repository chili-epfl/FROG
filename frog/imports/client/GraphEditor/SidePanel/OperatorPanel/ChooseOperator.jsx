// @flow

import React, { Component } from 'react';

import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import { withStyles } from '@material-ui/core/styles';
import Search from '@material-ui/icons/Search';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Collapse from '@material-ui/core/Collapse';
import type { operatorPackageT, OperatorDbT } from 'frog-utils';
import { Operators } from '/imports/api/operators';
import { operatorTypes, operatorTypesObj } from '/imports/operatorTypes';
import { type StoreProp } from '../../store';
import ListComponent from '../ListComponent';

type PropsT = StoreProp & {
  classes: Object,
  operator: OperatorDbT
};

type StateT = { expanded: ?string, searchStr: string };

const styles = {
  topPanel: {
    padding: '10px',
    margin: 8
  },
  operatorList: {
    overflowY: 'auto'
  },
  searchContainer: {
    position: 'relative',
    borderRadius: '5px',
    background: 'rgba(0,0,0,.05)'
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
  }
};

class OperatorCategory extends Component<any, any> {
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
            {items.map((x: operatorPackageT) => (
              <ListItem
                button
                key={x.id}
                onClick={() => this.props.onSelect(x)}
                classes={{ button: classes.List }}
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
const StyledOperatorCategory = withStyles(styles)(OperatorCategory);

class ChooseOperatorTypeComp extends Component<PropsT, StateT> {
  constructor(props: PropsT) {
    super(props);
    this.state = { expanded: null, searchStr: '' };
  }

  select = operatorType => {
    const graphOperator = this.props.store.operatorStore.all.find(
      op => op.id === this.props.operator._id
    );
    const newName =
      operatorTypesObj[operatorType.id].meta.shortName ||
      operatorTypesObj[operatorType.id].meta.name;
    Operators.update(this.props.operator._id, {
      $set: { operatorType: operatorType.id }
    });
    if (graphOperator) {
      graphOperator.rename(newName);
    }
  };

  handleSearch = e => {
    this.setState({
      expanded: null,
      searchStr: e.target.value.toLowerCase()
    });
  };

  handleExpand = (x: operatorPackageT) => () => {
    this.setState({ expanded: x.id });
  };

  render() {
    const { operator } = this.props;
    const categories = {
      product: [
        'Aggregate',
        'Distribute',
        'From API',
        'Peer-review',
        'Other',
        'Specialized'
      ],
      control: ['Control'],
      social: ['Simple', 'Complex', 'Deprecated']
    };
    const filteredList = operatorTypes
      .filter(x => x.type === this.props.operator.type)
      .filter(
        x =>
          x.meta.name.toLowerCase().includes(this.state.searchStr) ||
          x.meta.shortDesc.toLowerCase().includes(this.state.searchStr) ||
          x.meta.description.toLowerCase().includes(this.state.searchStr)
      )
      .sort((x: Object, y: Object) => (x.meta.name < y.meta.name ? -1 : 1));

    const { classes } = this.props;

    return (
      <Grid>
        <div className={classes.topPanel}>
          <Grid item>
            <Typography variant="h4">Select Operator</Typography>
          </Grid>
          <Grid container spacing={8} alignItems="flex-end" item>
            <Grid item>
              <Search fontSize="inherit" />
            </Grid>
            <Grid item>
              <TextField
                id="search-input"
                label="Search"
                onChange={(x: Object) => this.handleSearch(x)}
              />
            </Grid>
          </Grid>
        </div>
        <List component="nav">
          {this.state.searchStr === '' &&
            categories[operator.type].map((x: string, idx: number) => (
              <StyledOperatorCategory
                name={x}
                items={filteredList.filter(y => y.meta.category === x)}
                defaultState={idx === 0}
                onSelect={this.select}
                key={x}
              />
            ))}
          {this.state.searchStr !== '' &&
            filteredList.length !== 0 &&
            filteredList.map(x => (
              <ListItem
                button
                key={x.id}
                onClick={() => this.select(x)}
                classes={{ button: classes.List }}
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
          {this.state.searchStr !== '' && filteredList.length === 0 && (
            <ListItem key="no-match-search">
              <ListItemText
                inset
                primary={
                  'No ' + operator.type + ' operators matched your search'
                }
              />
            </ListItem>
          )}
        </List>
      </Grid>
    );
  }
}

export default withStyles(styles)(ChooseOperatorTypeComp);
