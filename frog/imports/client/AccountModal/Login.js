import * as React from 'react';
import {
  Avatar,
  Button,
  TextField,
  Grid,
  Typography,
  Container
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { withStyles } from '@material-ui/styles';
import { blueGrey } from '@material-ui/core/colors';
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
    backgroundColor: theme.palette.primary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    background: theme.palette.primary.main,
    margin: theme.spacing(2, 0),
    padding: theme.spacing(2),
    boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
    transition: '.25s ease',
    cursor: 'pointer',
    color: '#FFF',

    '&:hover': {
      background: theme.palette.primary.dark
    }
  },
  link: {
    cursor: 'pointer',
    color: blueGrey[500],
    fontSize: '1rem',
    textTransform: 'capitalize'
  }
});

type LoginPropsT = {
  classes: Object,
  OnLogin: (email: string, password: string) => void,
  openSignUpForm: () => void
};

const Login = ({ classes, onLogin, openSignUpForm }: LoginPropsT) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const setters = { email: setEmail, password: setPassword };
  const [showToast] = useToast();

  const handleChange = (
    event: SyntheticInputEvent<EventTarget>,
    type: string
  ) => {
    setError('');
    const value = event.target.value;
    setters[type](value);
  };

  const handleSubmit = (e: SyntheticEvent<EventTarget>) => {
    e.preventDefault();
    if (email === '' || password === '') {
      setError('Please fill out all fields');
    } else {
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
            error={error !== ''}
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
            error={error !== ''}
            helperText={error}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={error !== ''}
          >
            Log In
          </Button>
          <Grid container>
            <Grid item xs>
              <Button
                href="#"
                className={classes.link}
                onClick={() => {
                  Meteor.call('send.password.reminder', email, err => {
                    if (err) {
                      showToast(
                        'Could not find user with that email. Please try to enter another email in the email field above',
                        'error'
                      );
                    } else {
                      showToast(
                        'Sent a message to your e-mail address with a new password. Please check your spam folder if you have not received it within a few minutes. Use the new password to log in, and then change the password.',
                        'success'
                      );
                    }
                  });
                }}
              >
                Forgot password?
              </Button>
            </Grid>
            <Grid item>
              <Button onClick={openSignUpForm} className={classes.link}>
                {"Don't have an account? Sign Up"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default withStyles(styles)(Login);
