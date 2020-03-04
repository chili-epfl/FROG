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
  },
  rowEmail: {
    display: 'block',
    fontSize: '0.9em'
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
    Meteor.call('admin.users.all', (err, res) => {
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

  const parseEmail = user => {
    try {
      return user.emails[0].address;
    } catch {
      return null;
    }
  };

  const handleChange = attr => event => {
    const userList = value.completeList;
    const searchQuery = event.target.value.toLowerCase();
    if (searchQuery.length > 0) {
      const filteredList = userList.filter(item => {
        return (
          item.nameReference.toLowerCase().indexOf(searchQuery) > -1 ||
          (parseEmail(item)
            ? parseEmail(item).indexOf(searchQuery) > -1
            : false)
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
                    props.impersonate(
                      user._id,
                      user.isAnonymous ? 'Anonymous' : 'Verified'
                    );
                  }}
                >
                  {user.nameReference}
                  <i className={classes.rowEmail}>{parseEmail(user)}</i>
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
