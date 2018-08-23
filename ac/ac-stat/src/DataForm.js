// @flow

import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

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
    <h3>Data</h3>
    Select a zone to zoom on it
    <br />
    Double click on the graph to zoom out
    {Object.keys(data).map(trace =>
      <Table className={classes.table} key={trace}>
        <TableHead>
          <TableRow>
            {Object.keys(data[trace]).map(axis => <TableCell className={classes.head} key={axis}>{axis}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.values(data[trace])[0].map((entry, index) =>{
            const k = entry+''+index
            return (
            <TableRow key={k}>
              {Object.keys(data[trace]).map((axis) =>
                <TableCell key={axis}>
                  {data[trace][axis][index]}
                  <div />
                </TableCell>
              )
              }
            </TableRow>)}
          )

            }
        </TableBody>
      </Table>
    )}
  </div>
)};

export default withStyles(styles)(Data)
