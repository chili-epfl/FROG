// @flow

import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import FilteringPanel from './FilteringPanel'

const styles = () => ({
  table: {
    border: 'solid 1px'
  },
  head: {
    fontSize: 'large',
    backgroundColor: '#CCC'
  }
});

const Data = ({classes, data, dataFn}) => {
  console.log(data)
  return (
  <div style={{ width: '25%', overflowY: 'scroll' }}>
    <FilteringPanel/>
    <h3>Data</h3>
    {
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            {Object.keys(data[0]).map(axis => <TableCell className={classes.head} key={axis}>{axis}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {
            data.map((entry, index) => {
              const tmp = entry+''+index
              return (<TableRow key={tmp}>
                        {Object.values(entry).map(v =>
                          <TableCell key={tmp+v}>
                            {v}
                          </TableCell>
                        )}
              </TableRow>)}
            )
          }
        </TableBody>
      </Table>

    }
  </div>
)};

export default withStyles(styles)(Data)
