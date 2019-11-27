import * as React from 'react';
import { makeStyles, Button } from '@material-ui/core';
import { Logo } from '/imports/ui/Logo';
import { blueGrey } from '@material-ui/core/colors';

const useStyle = makeStyles(theme => ({
  root: {
    position: 'fixed',
    top: '0',
    height: theme.spacing(10),
    background: '#FFF',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: theme.spacing(0, 4),
    boxShadow: '0px 2px 15px rgba(0,0,0,0.05)',
    margin: '0',
    zIndex: '100'
  },
  link: {
    color: blueGrey[900],
    textTransform: 'capitalize',
    fontSize: '1rem',
    margin: theme.spacing(0, 1)
  },
  button: {
    color: '#FFF',
    textTransform: 'capitalize',
    fontSize: '1rem',
    margin: theme.spacing(0, 1),
    background: theme.palette.primary.main,
    boxShadow: '0 0 0 transparent',

    '&:hover': {
      background: theme.palette.primary.dark
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
      <div>
        <Logo />
      </div>
      <div>
        <a href="https://froglearning.wordpress.com">
          <Button className={classes.link}>About</Button>
          <Button className={classes.link}>How it Works</Button>
        </a>
        <Button
          variant="contained"
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
