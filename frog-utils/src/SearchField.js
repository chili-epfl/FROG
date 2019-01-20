// @flow

import * as React from 'react';
import { debounce } from 'lodash';

import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Search from '@material-ui/icons/Search';
import Clear from '@material-ui/icons/Clear';

export default class SearchField extends React.Component<*, *> {
  state = { search: '' };

  updateSearch = debounce(e => {
    if (this.props.logger) {
      this.props.logger({ type: 'search', value: e });
    }
    this.props.onChange(e);
  }, 1000);

  render() {
    const { classes } = this.props;
    return (
      <TextField
        className={classes.margin}
        id="search"
        label="Search"
        value={this.state.search}
        onChange={e => {
          e.persist();
          this.setState({ search: e.target.value });
          this.updateSearch(e.target.value);
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <div
                onClick={() => {
                  if (this.props.logger) {
                    this.props.logger({ type: 'resetSearch' });
                  }
                  this.setState({ search: '' });
                  this.props.onChange('');
                }}
              >
                <Clear />
              </div>
            </InputAdornment>
          )
        }}
      />
    );
  }
}
