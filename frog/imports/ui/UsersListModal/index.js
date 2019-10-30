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
import { RowButton } from '/imports/ui/RowItems';
import { Meteor } from 'meteor/meteor';

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
  const [value, setValue] = React.useState({
    list: [],
    completeList: [],
    message: 'Loading'
  });

  React.useEffect(() => {
    Meteor.call('frog.users.all', (err, res) => {
      if (err) {
        console.info(err);
        setValue({ ...value, message: 'Error Loading Users' });
      } else if (res.length > 0) {
        setValue({ list: res, completeList: res, message: 'Success' });
      } else {
        setValue({ ...value, message: 'No results' });
      }
    });
  }, []);

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
    const userList = value.completeList;
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
          {value.message === 'Success' ? (
            value.list?.length > 0 ? (
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
              <RowButton size="large" disabled>
                No users found
              </RowButton>
            )
          ) : (
            <RowButton size="large" disabled>
              {value.message}
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
