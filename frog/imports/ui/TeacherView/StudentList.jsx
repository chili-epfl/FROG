// @flow

import React from 'react';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from 'material-ui/Table';
import Grid from 'material-ui/Grid';
import Card, { CardContent } from 'material-ui/Card';

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

@withStyles(styles)
export class StudentStatus extends React.Component {
  render() {
    const { classes, students } = this.props;

    return (
      <div className={classes.root}>
        <Grid id="graph-session" item xs={12}>
          <Card id="card">
            <CardContent id="content">
              <Typography type="title" className={classes.title}>
                Student Status
              </Typography>
              <Table className={classes.table}>
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
  }
}

const StudentList = ({ students }: { students: Array<Object> }) => (
  <StudentStatus students={students} />
);

export default StudentList;
