import * as React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { blueGrey } from '@material-ui/core/colors';

const useStyle = makeStyles(theme => ({
  root: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  reverse: {
    flexDirection: 'row-reverse'
  },
  imgContainer: {
    position: 'relative',
    height: '200px',
    width: '200px',
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
  textWrapper: {
    width: `calc(100% - 200px - ${2 * theme.spacing(5)}px)`,
    minWidth: '300px',
    margin: theme.spacing(5)
  },
  title: {
    fontSize: '1.4rem',
    fontWeight: '500',
    color: blueGrey[900],
    marginBottom: theme.spacing(1)
  },
  content: {
    fontSize: '.9rem',
    color: blueGrey[400],
    lineHeight: '2'
  }
}));

type StepRowProps = {
  title: string,
  imageURL: string,
  children?: React.Element<*>,
  variant?: 'reverse' | 'default'
};

export const StepRow = (props: StepRowProps) => {
  const classes = useStyle();
  return (
    <div
      className={`${classes.root} ${
        props.variant === 'reverse' ? classes.reverse : ''
      }`}
    >
      <div className={classes.imgContainer}>
        <img src={props.imageURL} className={classes.img} alt={props.title} />
      </div>
      <div className={classes.textWrapper}>
        <Typography
          className={classes.title}
          align={props.variant === 'reverse' ? 'right' : 'left'}
        >
          {props.title}
        </Typography>
        <Typography
          className={classes.content}
          align={props.variant === 'reverse' ? 'right' : 'left'}
        >
          {props.children}
        </Typography>
      </div>
    </div>
  );
};
