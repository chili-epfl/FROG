import * as React from 'react';
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';
import List, {
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction
} from 'material-ui/List';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import Delete from '@material-ui/icons/Delete';
import { withStyles } from 'material-ui/styles';
import { Sessions } from '../../api/sessions';

import styles from './styles';

class Roster extends React.Component {
  studentlist = [];
  state = {
    studentName: ''
  };

  constructor(props) {
    super(props);
    const { session } = this.props;
    this.studentlist = session.studentlist ? session.studentlist : [];
  }

  handleChange = (event: Object) => {
    this.setState({ studentName: String(event.target.value) });
  };
  handleAddStudent = () => {
    const { session } = this.props;

    if (this.state.studentName !== undefined && this.state.studentName !== '') {
      this.studentlist.push(this.state.studentName);
      Sessions.update(session._id, {
        $set: {
          studentlist: this.studentlist
        }
      });
    }
  };

  handleDeleteStudent = (student: string) => {
    const { session } = this.props;
    if (student !== undefined) {
      const index = this.studentlist.indexOf(student);
      if (index > -1) {
        this.studentlist.splice(index, 1);
        Sessions.update(session._id, {
          $set: {
            studentlist: this.studentlist
          }
        });
      }
    }
  };

  render() {
    const { classes, onClose, session, ...other } = this.props;
    return (
      <Dialog
        onClose={onClose}
        aria-labelledby="simple-dialog-title"
        {...other}
      >
        <DialogTitle id="simple-dialog-title">Roster</DialogTitle>
        <DialogContent>
          <div>
            <List>
              {session.studentlist ? (
                session.studentlist.map(student => (
                  <ListItem
                    button
                    key={student}
                    // onClick={() => this.handleListItemClick(student)}
                  >
                    <ListItemAvatar>
                      <Avatar className={classes.avatar}>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={student} />
                    <ListItemSecondaryAction>
                      <IconButton
                        aria-label="Delete"
                        id={student}
                        onClick={() => this.handleDeleteStudent(student)}
                      >
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))
              ) : (
                <ListItem key="none">
                  <ListItemText primary="no students" />
                </ListItem>
              )}
            </List>
            <Grid
              container
              className={classes.root}
              justify="center"
              spacing={8}
            >
              <Grid item>
                <div className={classes.root}>
                  <FormControl
                    className={classes.formControl}
                    aria-describedby="name-helper-text"
                  >
                    <InputLabel htmlFor="name-helper">Name</InputLabel>
                    <Input
                      id="name-helper"
                      value={this.state.studentName}
                      onChange={this.handleChange}
                    />
                    <FormHelperText id="name-helper-text">
                      Add a student to the current session
                    </FormHelperText>
                  </FormControl>
                  <IconButton
                    className={classes.button}
                    color="default"
                    size="small"
                    onClick={this.handleAddStudent}
                  >
                    <AddIcon className={classes.leftIcon} />
                  </IconButton>
                </div>
              </Grid>
            </Grid>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(Roster);
