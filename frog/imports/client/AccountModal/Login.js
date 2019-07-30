import * as React from 'react';
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
import { withStyles } from '@material-ui/core/styles';

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
type LoginStateT = {
  email: string,
  password: string
};

type LoginPropsT = {
  classes: Object,
  OnLogin: (email: string, password: string) => void,
  openSignUpForm: () => void
};

class Login extends React.Component<LoginStateT, LoginPropsT> {
  constructor() {
    super();
    this.state = {
      email: '',
      password: ''
    };
  }

  handleChange = (event: SyntheticInputEvent<EventTarget>, type: string) => {
    const value = event.target.value;
    this.setState({ [type]: value });
  };

  handleSubmit = (e: SyntheticEvent<EventTarget>) => {
    e.preventDefault();
    const { email, password } = this.state;
    if (email === '' || password === '')
      window.alert('Please fill out all fields');
    else {
      this.props.onLogin(email, password);
    }
  };

  render() {
    const { classes } = this.props;
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
            onSubmit={e => this.handleSubmit(e)}
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
              onChange={e => this.handleChange(e, 'email')}
              autoComplete="email"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              onChange={e => this.handleChange(e, 'password')}
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
                  onClick={this.props.openSignUpForm}
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
  }
}
export default withStyles(styles)(Login);
