// @flow

import React, { Component } from 'react';

import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import { withStyles } from '@material-ui/core/styles';
import Search from '@material-ui/icons/Search';

import type { operatorPackageT, OperatorDbT } from 'frog-utils';
import { Operators } from '/imports/api/activities';
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
    padding: '10px'
  },
  operatorList: {
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
  resultContainer: {
    height: '100%'
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
      <Typography variant="body2">No results found</Typography>
    </Grid>
  </Grid>
);

const StyledNoResult = withStyles(styles)(NoResult);

const ChooseOperatorTopPanel = ({ classes, onSearch }) => (
  <Grid container className={classes.topPanel} alignItems="center" spacing={8}>
    <Grid item xs={12}>
      <Typography variant="title">Select Operator type</Typography>
    </Grid>
    <Grid item xs={12}>
      <div className={classes.searchContainer}>
        <div className={classes.searchIcon}>
          <Search />
        </div>
        <input
          type="text"
          onChange={onSearch}
          className={classes.searchInput}
          aria-describedby="search-operator"
        />
      </div>
    </Grid>
    <Grid item xs={12}>
      <Divider />
    </Grid>
  </Grid>
);

const StyledChooseOperatorTopPanel = withStyles(styles)(ChooseOperatorTopPanel);

class ChooseOperatorTypeComp extends Component<PropsT, StateT> {
  constructor(props: PropsT) {
    super(props);
    this.state = { expanded: null, searchStr: '' };
  }

  handleSelect = operatorType => () => {
    const graphOperator = this.props.store.operatorStore.all.find(
      op => op.id === this.props.operator._id
    );
    const newName =
      operatorTypesObj[operatorType.id].meta.shortName ||
      operatorTypesObj[operatorType.id].meta.name;
    Operators.update(this.props.operator._id, {
      $set: { operatorType: operatorType.id }
    });
    graphOperator.rename(newName);
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
      <Grid container>
        <Grid item xs={12}>
          <StyledChooseOperatorTopPanel onSearch={this.handleSearch} />
        </Grid>

        <Grid item xs={12} className={classes.operatorList}>
          {filteredList.length === 0 ? (
            <StyledNoResult />
          ) : (
            <List>
              {filteredList.map((x: operatorPackageT) => (
                <ListComponent
                  onSelect={this.handleSelect(x)}
                  showExpanded={this.state.expanded === x.id}
                  expand={this.handleExpand(x)}
                  key={x.id}
                  onPreview={() => {}}
                  object={x}
                  searchS={this.state.searchStr}
                  eventKey={x.id}
                />
              ))}
            </List>
          )}
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(ChooseOperatorTypeComp);
