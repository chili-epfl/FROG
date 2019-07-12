import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { Meteor } from 'meteor/meteor';
import { withStyles } from '@material-ui/styles';
import {
  errorBasedOnChars,
  emailErrors,
  passwordErrors
} from './validationHelpers';

import { type SignUpStateT } from './types';

const styles = theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
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
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
});
const formValid = ({ formErrors, ...rest }) => {
  let valid = true;

  Object.values(formErrors).forEach(val => val.length > 0 && (valid = false));

  Object.values(rest).forEach(val => val === null && (valid = false));

  return valid;
};

class SignUp extends React.Component<{}, SignUpStateT> {
  constructor() {
    super();
    this.state = {
      displayName: '',
      email: '',
      password: '',
      formErrors: {
        displayName: '',
        email: '',
        password: ''
      },
      serverErrors: {}
    };
  }

  handleChange = (event: Object, type: string) => {
    const value = event.target.value;
    const formErrors = { ...this.state.formErrors };
    switch (type) {
      case 'displayName':
        formErrors.displayName = errorBasedOnChars(value, 1, 'Display Name');
        break;
      case 'email':
        formErrors.email = emailErrors(value);
        break;
      case 'password':
        formErrors.password = passwordErrors(value);
        break;
      default:
        break;
    }

    this.setState({ formErrors, [type]: value });
  };

  handleSubmit = async (e: Object) => {
    e.preventDefault();
    if (formValid(this.state)) {
      Meteor.call(
        'create.account',
        this.state.email,
        this.state.password,
        {
          displayName: this.state.displayName
        },
        function(error) {
          if (error) {
            window.alert(error);
            this.setState({ serverErrors: error });
          } else {
            window.alert('Success! Account created! ');
            this.props.hideModal();
          }
        }
      );
    } else {
      window.alert("Your account couldn't be created");
    }
  };

  render() {
    const { classes } = this.props;

    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Create an account with FROG
          </Typography>
          <form
            className={classes.form}
            onSubmit={e => this.handleSubmit(e)}
            noValidate
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="fname"
                  name="displayName"
                  error={this.state.formErrors.displayName !== ''}
                  variant="outlined"
                  required
                  fullWidth
                  helperText={this.state.formErrors.displayName}
                  id="displayName"
                  label="Display Name"
                  onChange={e => this.handleChange(e, 'displayName')}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  error={this.state.formErrors.email !== ''}
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  helperText={this.state.formErrors.email}
                  onChange={e => this.handleChange(e, 'email')}
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  error={this.state.formErrors.password !== ''}
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  helperText={this.state.formErrors.password}
                  onChange={e => this.handleChange(e, 'password')}
                  autoComplete="current-password"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Sign Up
                </Button>
              </Grid>
            </Grid>

            <Grid container justify="flex-end">
              <Grid item>
                <Link href="#" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    );
  }
}

export default withStyles(styles)(SignUp);
