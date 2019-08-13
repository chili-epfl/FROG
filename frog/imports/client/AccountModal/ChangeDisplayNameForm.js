/* eslint-disable no-unused-expressions */
// disable no-unused-expressions for flow typing state when using hooks
// @flow
import * as React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useToast } from '/imports/ui/Toast';
import { errorBasedOnChars } from '/imports/frog-utils/validationHelpers';

const useStyles = makeStyles(theme => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

type ChangeDisplayNameFormPropsT = {
  onChangeDisplayName: (newDisplayName: string) => void
};

const ChangeDisplayNameForm = ({
  onChangeDisplayName
}: ChangeDisplayNameFormPropsT) => {
  const classes = useStyles();
  const [showToast, _1] = useToast();
  const [newDisplayName, setNewDisplayName] = React.useState('');
  (newDisplayName: string);

  const handleSubmit = event => {
    event.preventDefault();
    if (errorBasedOnChars(newDisplayName, 1, 'Display Name') === '')
      onChangeDisplayName(newDisplayName);
    else {
      showToast(errorBasedOnChars(newDisplayName, 1, 'Display Name'), 'error');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Change display name
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            onChange={() => setNewDisplayName(event.target.value)}
            id="newDisplayName"
            label="New Display Name"
            name="newDisplayName"
            autoComplete="name"
            autoFocus
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Submit
          </Button>
        </form>
      </div>
    </Container>
  );
};
export default ChangeDisplayNameForm;
