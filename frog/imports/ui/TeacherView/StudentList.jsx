// @flow weak

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginBottom: 2
  },
  title: {
    marginBottom: 16,
    fontSize: 14
  },
  table: {
    flexGrow: 1
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  }
});

const StudentStatus = ({ students }) => (
  <div className={styles.root}>
    <Grid id="graph-session" item xs={12}>
      <Card id="card">
        <CardContent id="content">
          <Typography type="title" className={styles.title}>
            Student Status
          </Typography>
          <Table className={styles.table}>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell numeric>Online (active)</TableCell>
                <TableCell numeric>Online (idle)</TableCell>
                <TableCell numeric>Offline</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Students</TableCell>
                <TableCell numeric>
                  {
                    students.filter(
                      x => x.status && x.status.online && !x.status.idle
                    ).length
                  }
                </TableCell>
                <TableCell numeric>
                  {
                    students.filter(
                      x => x.status && x.status.online && x.status.idle
                    ).length
                  }
                </TableCell>
                <TableCell numeric>
                  {
                    students.filter(
                      x => x.status && !x.status.online && !x.status.idle
                    ).length
                  }
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Grid>
  </div>
);

export default withStyles(styles)(StudentStatus);
