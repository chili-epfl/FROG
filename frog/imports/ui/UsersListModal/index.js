import * as React from 'react';
import {
  Button,
  TextField,
  makeStyles,
  Dialog,
  DialogActions,
  DialogContent,
  Typography
} from '@material-ui/core';
import { getAllUsers } from '/imports/api/users';
import { RowButton } from '/imports/ui/RowItems';

const useStyle = makeStyles(theme => ({
  root: {
    width: '600px'
  },
  userListWrapper: {
    width: '100%',
    maxHeight: '70vh',
    overflow: 'auto'
  },
  title: {
    padding: theme.spacing(1, 0),
    margin: theme.spacing(1, 0),
    borderBottom: '1px solid rgba(0,0,0,.1)'
  }
}));

type UsersListModalProps = {
  open: boolean,
  impersonate: string => void,
  closeModal: () => void
};

const UsersListModal = (props: UsersListModalProps) => {
  const classes = useStyle();
  const userList = getAllUsers();
  const [value, setValue] = React.useState({ list: userList });

  const parseUsername = user => {
    if (user.isAnonymous) {
      return 'Anonymous User';
    } else if (user.emails && user.profile) {
      return user.profile.displayName;
    } else if (user.username) {
      return user.username;
    } else {
      return 'Undefined User';
    }
  };

  const handleChange = attr => event => {
    const searchQuery = event.target.value.toLowerCase();
    if (searchQuery.length > 0) {
      const filteredList = userList.filter(item => {
        return (
          parseUsername(item)
            .toLowerCase()
            .indexOf(searchQuery) > -1
        );
      });
      setValue({ ...value, [attr]: filteredList });
    } else {
      setValue({ ...value, [attr]: userList });
    }
  };

  return (
    <Dialog open={props.open}>
      <DialogContent className={classes.root}>
        <Typography variant="h5" className={classes.title}>
          Impersonate a User
        </Typography>
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="search"
          name="search"
          placeholder="Search"
          onChange={handleChange('list')}
        />
        <div className={classes.userListWrapper}>
          {value.list.length > 0 ? (
            value.list.map(user => (
              <RowButton
                key={user._id}
                size="large"
                onClick={() => {
                  props.impersonate(user._id);
                }}
              >
                {parseUsername(user)}
              </RowButton>
            ))
          ) : (
            <RowButton size="large" disabled={true}>
              No users found
            </RowButton>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.closeModal}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UsersListModal;
