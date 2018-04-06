// @flow
/* eslint-disable react/no-array-index-key */

import * as React from 'react';

import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import TextField from 'material-ui/TextField';

const styles = {
  drawer: {
    marginTop: '48px',
    width: 250,
    height: 'calc(100% - 48px)'
  },
  button: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: '10'
  },
  text: {
    width: '125px',
    margin: 'auto'
  }
};

const names = [
  'Chen Li',
  'Maurice',
  'Edgar',
  'Noel',
  'Patrick',
  'Ole',
  'Niels',
  'Stian',
  'Jenny',
  'Prastut',
  'Pierre',
  'Louis'
];

const StudentBox = ({ name, group, plane, onChange, classes }) => (
  <div>
    <TextField
      label="Name"
      value={name}
      onChange={e => onChange({ name: e.target.value, group })}
      className={classes.text}
    />
    {plane === 2 && (
      <TextField
        label="Group"
        value={group}
        onChange={e => onChange({ name, group: e.target.value })}
        className={classes.text}
      />
    )}
  </div>
);

const StyledStudentBox = withStyles(styles)(StudentBox);

class SocialPanel extends React.Component {
  state = {
    open: false,
    students: [{ name: names[0], group: 1 }],
    plane: 1
  };

  render() {
    const { classes, setUsers, setInstances, setPlane } = this.props;
    const { open, students, plane } = this.state;

    const toggle = () => this.setState({ open: !open });
    const add = () => {
      const newStudent = {
        name: names[students.length % names.length],
        group: 1 + Math.floor(students.length / 2)
      };
      this.setState({ students: [...students, newStudent] });
    };
    const remove = () => {
      this.setState({ students: students.slice(0, students.length - 1) });
    };
    const switchPlane = () => this.setState({ plane: 1 + plane % 3 });
    const changeStudent = idx => newStudent => {
      this.state.students[idx] = newStudent;
      this.forceUpdate();
    };

    const save = () => {
      setPlane(plane);
      setUsers(students.map(s => s.name));
      setInstances(
        students.map(s => ({ 1: s.name, 2: s.group, 3: 'all' }[plane]))
      );
      toggle();
    };

    return (
      <div>
        <Button
          onClick={toggle}
          variant="fab"
          className={classes.button}
          color="primary"
        >
          <AddIcon />
        </Button>
        <Drawer
          anchor="right"
          open={open}
          classes={{ paper: classes.drawer }}
          onClose={toggle}
        >
          <Button color="primary" onClick={switchPlane}>
            {'PLANE ' + plane}
          </Button>
          <Button color="primary" onClick={add}>
            ADD
          </Button>
          <Button color="primary" onClick={remove}>
            REMOVE
          </Button>
          {students.map((s, i) => (
            <StyledStudentBox
              key={i}
              {...s}
              plane={plane}
              onChange={changeStudent(i)}
            />
          ))}
          <Button color="primary" onClick={save}>
            APPLY
          </Button>
          <Button color="secondary" onClick={toggle}>
            DISCARD
          </Button>
        </Drawer>
      </div>
    );
  }
}

export default withStyles(styles)(SocialPanel);
