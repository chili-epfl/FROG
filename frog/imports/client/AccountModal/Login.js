import * as React from 'react';
import _ from 'lodash';
import {
  Avatar,
  Button,
  TextField,
  Link,
  Grid,
  Typography,
  Container
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { withStyles } from '@material-ui/styles';
import { useToast } from '/imports/ui/Toast';

const styles = (theme: Object) => ({
  paper: {
    marginTop: theme.spacing(1),
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
    margin: theme.spacing(2, 0, 2, 0)
  },
  signupLink: {
    cursor: 'pointer'
  }
});

type LoginPropsT = {
  classes: Object,
  OnLogin: (email: string, password: string) => void,
  openSignUpForm: () => void
};

const Login = ({ classes, onLogin, openSignUpForm }: LoginPropsT) => {
  const [showToast] = useToast();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const setters = { email: setEmail, password: setPassword };

  const handleChange = (
    event: SyntheticInputEvent<EventTarget>,
    type: string
  ) => {
    const value = event.target.value;
    setters[type](value);
  };

  const handleSubmit = (e: SyntheticEvent<EventTarget>) => {
    e.preventDefault();
    if (email === '' || password === '')
      showToast('Please fill out all fields', 'error');
    else {
      onLogin(email, password);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Log in to FROG
        </Typography>
        <form
          className={classes.form}
          onSubmit={e => handleSubmit(e)}
          noValidate
        >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            onChange={e => handleChange(e, 'email')}
            autoComplete="email"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            onChange={e => handleChange(e, 'password')}
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Log In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link
                onClick={openSignUpForm}
                className={classes.signupLink}
                variant="body2"
              >
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default withStyles(styles)(Login);

