import * as React from 'react';
import {
  makeStyles,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button
} from '@material-ui/core';
import { blueGrey } from '@material-ui/core/colors';
import { Visibility, VisibilityOff, Close } from '@material-ui/icons';

const useStyle = makeStyles(theme => ({
  root: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    width: `calc(40% - ${theme.spacing(6)}px)`,
    minWidth: `calc(300px - ${theme.spacing(6)}px)`,
    padding: theme.spacing(6),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    borderRadius: '10px',
    boxShadow: `0 0 30px rgba(0,0,0,.05)`,
    background: '#FFF',
    zIndex: '200'
  },
  title: {
    fontWeight: '400',
    color: blueGrey[900],
    marginBottom: theme.spacing(2)
  },
  form: {
    width: '100%'
  },
  input: {
    width: '100%',
    margin: theme.spacing(1.5, 0)
  },
  button: {
    textTransform: 'none',
    fontWeight: '400',
    fontSize: '1rem',
    color: blueGrey[700],
    margin: theme.spacing(1),
    boxShadow: '0 0 0 transparent',

    '&:active': {
      boxShadow: '0 0 0 transparent'
    }
  },
  filled: {
    margin: theme.spacing(1, 0),
    padding: theme.spacing(1.5, 0),
    width: '100%',
    background: theme.palette.primary.main,
    color: '#FFF',

    '&:hover': {
      background: theme.palette.primary.dark
    }
  },
  closeIcon: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1)
  },
  blackScreen: {
    height: '100vh',
    width: '100vw',
    background: 'rgba(0,0,0,.5)',
    position: 'fixed',
    top: '0',
    left: '0',
    zIndex: '150'
  }
}));

type SigninCardProps = {
  onSignEnter: (email: String, password: string) => void,
  onForgotPassword: () => void,
  onCreateAccount: () => void,
  closeSignin: () => void
};

export const SigninCard = (props: SigninCardProps) => {
  const classes = useStyle();

  const [values, setValues] = React.useState({
    email: '',
    password: '',
    showPassword: false
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  return (
    <React.Fragment>
      <div className={classes.blackScreen} />
      <div className={classes.root}>
        <IconButton
          aria-label="close sign-in panel"
          onClick={() => {
            props.closeSignin();
          }}
          className={classes.closeIcon}
        >
          <Close />
        </IconButton>
        <Typography variant="h5" className={classes.title}>
          Sign In
        </Typography>
        <form className={classes.form}>
          <TextField
            label="E-mail"
            variant="outlined"
            className={classes.input}
            value={values.email}
            onChange={handleChange('email')}
            margin="normal"
            placeholder="E-mail"
          />
          <TextField
            className={classes.input}
            variant="outlined"
            type={values.showPassword ? 'text' : 'password'}
            label="Password"
            value={values.password}
            onChange={handleChange('password')}
            placeholder="Password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {values.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Button
            variant="contained"
            color="primary"
            className={`${classes.button} ${classes.filled}`}
            onClick={() => {
              props.onSignEnter(values.email, values.password);
            }}
          >
            Sign In
          </Button>
          <Button
            className={classes.button}
            onClick={() => {
              props.onForgotPassword();
            }}
          >
            Forgot Password?
          </Button>
          <Button
            className={classes.button}
            onClick={() => {
              props.onCreateAccount();
            }}
          >
            Create an account
          </Button>
        </form>
      </div>
    </React.Fragment>
  );
};
