// @flow

import * as React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/core/styles';
import { type DashboardT, type LogDbT } from 'frog-utils';

const styles = () => ({
  table: {
    minWidth: 700
  },
  head: {
    fontSize: 'large'
  }
});

const ViewerStyleless = ({ state, classes }) => (
  <Table className={classes.table}>
    <TableHead>
      <TableRow>
        <TableCell className={classes.head}>Word</TableCell>
        <TableCell className={classes.head}>N° of highlights</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {Object.keys(state)
        .filter(x => state[x] > 0)
        .sort((a, b) => (state[a] > state[b] ? -1 : 1))
        .map(word => (
          <TableRow key={word}>
            <TableCell>
              {word}
              <div />
            </TableCell>
            <TableCell>{state[word]}</TableCell>
          </TableRow>
        ))}
    </TableBody>
  </Table>
);

const mergeLog = (state: any, log: LogDbT) => {
  switch (log.type) {
    case 'plus':
      state[log.value] = state[log.value] ? (state[log.value] += 1) : 1;
      break;
    case 'minus':
      state[log.value] -= 1;
      break;
    default:
  }
};

const initData = {};

const dashboardRank: DashboardT = {
  Viewer: withStyles(styles)(ViewerStyleless),
  mergeLog,
  initData
};

export default dashboardRank ;
