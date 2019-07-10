import  React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {type SignUpStateT } from './types';
import {Meteor} from 'meteor/meteor';
import { withStyles } from '@material-ui/styles';
import { withTheme } from '@material-ui/styles';
 
 const styles = theme  => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
});


 class  SignUp extends React.Component<{}, SignUpStateT> {
  
 

  constructor(){
    super();
    this.state = {
      displayName:'',
      email: '',
      password:''

    };
  }

   handleChange = (event: Object , type: string ) => {
     const value = event.target.value; 
     const nextState = {}; 
     nextState[type] = value; 
     this.setState(nextState); 
   }
  
  handleSubmit = async (e: Object) => {
    e.preventDefault(); 
    Meteor.call('create.account', this.state.email , this.state.password, {displayName: this.state.displayName});

  }
  render(){
    const {classes} = this.props; 

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
        <form className={classes.form} noValidate onSubmit = {e => this.handleSubmit(e)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="displayName"
                variant="outlined"
                required
                fullWidth
                id="displayName"
                label="Display Name"
                onChange = {(e) => this.handleChange(e,"displayName")}
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                onChange = {(e) => this.handleChange( e,"email")}
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                onChange = {(e) => this.handleChange(e,"password")}
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
          <Grid item xs = {6}>
           <Link href="#" variant="body2">
              Forgot password? 
              </Link>
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