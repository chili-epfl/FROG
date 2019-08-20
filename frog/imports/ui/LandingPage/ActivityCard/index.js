import * as React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { blueGrey } from '@material-ui/core/colors';

const useStyle = makeStyles(theme => ({
  root: {
    minWidth: '180px',
    borderRadius: '5px',
    background: 'rgba(255,255,255,.05)',
    padding: theme.spacing(4, 0),
    margin: theme.spacing(0.5),
    transition: '.25s ease',
    cursor: 'pointer',

    '&:hover': {
      background: 'rgba(255,255,255,.1)'
    },
    '&:active': {
      transform: 'scale(0.95)'
    }
  },
  imgContainer: {
    position: 'relative',
    left: '50%',
    transform: 'translate(-50%,0)',
    height: '80px',
    width: '80px',
    borderRadius: '100%',
    overflow: 'hidden',
    background: blueGrey[100]
  },
  img: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    height: '100%',
    width: '100%',
    transform: 'translate(-50%,-50%)'
  },
  title: {
    width: '80%',
    fontSize: '1rem',
    fontWeight: '400',
    color: '#FFF',
    margin: `0 auto`,
    lineHeight: '1',
    marginTop: theme.spacing(2),
    textAlign: 'center'
  }
}));

type ActivityCardProps = {
  title: string,
  imageURL: string
};

export const ActivityCard = (props: ActivityCardProps) => {
  const classes = useStyle();
  return (
    <div className={classes.root} onClick={props.onClick}>
      <div className={classes.imgContainer}>
        <img src={props.imageURL} className={classes.img} alt={props.title} />
      </div>
      <Typography className={classes.title}>{props.title}</Typography>
    </div>
  );
};
