import * as React from 'react';
import { makeStyles, Typography, Button } from '@material-ui/core';
import { blueGrey } from '@material-ui/core/colors';
import { primaryColor, primaryColorDark } from '../constants';

const useStyle = makeStyles(theme => ({
  root: {
    position: 'fixed',
    top: '0',
    height: theme.spacing(8),
    background: '#FFF',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: theme.spacing(0, 4),
    boxShadow: '0px 2px 0px rgba(0,0,0,0.05)',
    margin: '0',
    zIndex: '100'
  },
  logo: {
    fontWeight: '600',
    fontSize: '16px',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    color: primaryColor
  },
  link: {
    color: blueGrey[900],
    fontWeight: 500,
    textTransform: 'capitalize',
    margin: theme.spacing(0, 1)
  },
  button: {
    color: '#FFF',
    fontWeight: 500,
    textTransform: 'capitalize',
    margin: theme.spacing(0, 1),
    background: primaryColor,
    boxShadow: '0 0 0 transparent',

    '&:hover': {
      background: primaryColorDark
    },
    '&:active': {
      boxShadow: '0 0 0 transparent'
    }
  }
}));

type HeaderProps = {
  openSignin: () => void
};

export const Header = (props: HeaderProps) => {
  const classes = useStyle();
  return (
    <header className={classes.root}>
      <Typography className={classes.logo}>Frog</Typography>
      <div>
        <Button className={classes.link}>About</Button>
        <Button className={classes.link}>How it Works</Button>
        <Button
          variant='contained'
          className={classes.button}
          onClick={() => {
            props.openSignin();
          }}
        >
          Sign In
        </Button>
      </div>
    </header>
  );
};
