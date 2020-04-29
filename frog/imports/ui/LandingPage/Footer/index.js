import * as React from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { blueGrey } from '@material-ui/core/colors';

const useStyle = makeStyles(theme => ({
  root: {
    background: '#FFF',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: `calc(100% - ${2 * theme.spacing(4)}px)`,
    padding: theme.spacing(4),
    margin: '0'
  },
  linksWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '80%',
    margin: `${theme.spacing(4)}px auto`
  },
  col: {
    width: 'auto',
    minWidth: '200px',
    margin: theme.spacing(1)
  },
  linksTitle: {
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    fontWeight: '500',
    marginBottom: theme.spacing(2),
    color: blueGrey[200]
  },
  link: {
    fontSize: '1.1rem',
    margin: theme.spacing(1.5, 0),
    color: blueGrey[900],
    cursor: 'pointer',
    transition: '.25s ease',

    '&:hover': {
      color: theme.palette.primary.main
    }
  },
  footerText: {
    width: '100%',
    fontSize: '0.8rem',
    fontWeight: '400',
    letterSpacing: '2px',
    margin: theme.spacing(2, 4),
    marginBottom: '0',
    textAlign: 'center',
    color: blueGrey[100]
  }
}));

export const Footer = () => {
  const classes = useStyle();
  return (
    <footer className={classes.root}>
      <div className={classes.linksWrapper}>
        <div className={classes.col}>
          <Typography variant="body2" className={classes.linksTitle}>
            Frog
          </Typography>
          <Typography variant="body2" className={classes.link}>
            About
          </Typography>
          <Typography variant="body2" className={classes.link}>
            Team
          </Typography>
        </div>
        <div className={classes.col}>
          <Typography variant="body2" className={classes.linksTitle}>
            Communities
          </Typography>
          <Typography variant="body2" className={classes.link}>
            Developers
          </Typography>
          <a href="https://github.com/chili-epfl/frog">
            <Typography variant="body2" className={classes.link}>
              Github
            </Typography>
          </a>
          <Typography variant="body2" className={classes.link}>
            Research
          </Typography>
        </div>
        <div className={classes.col}>
          <Typography variant="body2" className={classes.linksTitle}>
            Useful Links
          </Typography>
          <Typography variant="body2" className={classes.link}>
            Help
          </Typography>
          <Typography variant="body2" className={classes.link}>
            FAQs
          </Typography>
        </div>
      </div>
      <Typography variant="body2" className={classes.footerText}>
        FROG 2019
      </Typography>
    </footer>
  );
};
