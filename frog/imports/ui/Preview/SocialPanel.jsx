// @flow
/* eslint-disable react/no-array-index-key */

import * as React from 'react';
import Drawer from 'material-ui/Drawer';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import TextField from 'material-ui/TextField';

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

export const getSocialControls = ({
  users,
  setUsers,
  plane,
  setPlane,
  instances,
  setInstances
}: Object) => ({
  add: () => {
    const newName = names[users.length % names.length];
    const newGroup = 1 + Math.floor(users.length / 2);
    setUsers([...users, newName]);
    setInstances([...instances, [newName, newGroup, 'all'][plane - 1]]);
  },
  remove: () => {
    setUsers(users.slice(0, users.length - 1));
    setInstances(instances.slice(0, instances.length - 1));
  },
  switchPlane: () => {
    const newPlane = 1 + plane % 3;
    setPlane(newPlane);
    setInstances(
      users.map(
        (name, idx) => [name, 1 + Math.floor(idx / 2), 'all'][newPlane - 1]
      )
    );
  }
});

const StudentBox = ({ name, instance, plane, onChange, classes }) => (
  <div>
    <TextField
      label="Name"
      value={name}
      onChange={e => onChange(e.target.value, instance)}
      className={classes.text}
    />
    {plane === 2 && (
      <TextField
        label="Group"
        value={instance}
        onChange={e => onChange(name, e.target.value)}
        className={classes.text}
      />
    )}
  </div>
);

type PropsT = {
  classes: Object,
  users: string[],
  instances: string[],
  plane: number,
  setUsers: Function,
  setInstances: Function
};

type StateT = {
  open: boolean
};

class SocialPanel extends React.Component<PropsT, StateT> {
  state = {
    open: false
  };

  render() {
    const {
      classes,
      setUsers,
      setInstances,
      plane,
      users,
      instances
    } = this.props;
    const { open } = this.state;

    const toggle = () => this.setState({ open: !open });
    const { add, remove, switchPlane } = getSocialControls(this.props);
    const onChange = idx => (newName, newInstance) => {
      users[idx] = newName;
      setUsers(users);
      instances[idx] = newInstance;
      setInstances(instances);
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
          {users.map((name, i) => (
            <StudentBox
              key={i}
              classes={classes}
              name={name}
              instance={instances[i]}
              plane={plane}
              onChange={onChange(i)}
            />
          ))}
          <Button color="secondary" onClick={toggle}>
            CLOSE
          </Button>
        </Drawer>
      </div>
    );
  }
}

SocialPanel.displayName = 'SocialPanel';
export default SocialPanel;
