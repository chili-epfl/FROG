// @flow

import * as React from 'react';
import { makeStyles, Typography, ButtonBase, Avatar } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';

const variants = {
  default: {
    root: {
      cursor: 'pointer',
      transition: '.2s all'
    },
    text: {
      fontSize: '14px'
    }
  },
  large: {
    root: {
      height: '48px',
      cursor: 'pointer',
      transition: '.2s all'
    },
    text: {
      fontWeight: 700,
      fontSize: '16px'
    }
  },
  header: {
    root: {
      background: 'transparent',
      color: '#888'
    },
    text: {
      textTransform: 'uppercase',
      fontSize: '12px',
      fontWeight: 700
    }
  }
};

const active = {
  root: {
    background: '#31BFAE',
    color: 'white'
  },
  text: {}
};

const useStyle = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '32px',
    padding: theme.spacing(0, 2),

    display: 'flex',
    alignItems: 'center',

    '&:hover': {
      background: 'rgba(0,0,0,0.1)'
    },

    '& svg:first-child': {
      marginRight: theme.spacing(2)
    },

    '& svg:last-child': {
      marginLeft: theme.spacing(2)
    },

    '& svg:only-child': {
      margin: 0
    }
  },
  text: {
    flexGrow: 1,
    lineHeight: 1
  }
}));

type RowPropsT = {
  className?: string,
  active?: boolean,
  variant?: string,
  leftIcon?: React.Element<*>,
  rightIcon?: React.Element<*>,
  text?: string,
  onClick?: () => void
};

/**
 * Displays a title and subtitle. Used with the sidebar component.
 */
export const Row = (props: RowPropsT) => {
  const classes = useStyle();
  const variantStyles = variants[props.variant || 'default'];

  return (
    <div
      className={classes.root}
      onClick={props.onClick}
      style={{
        ...variantStyles.root,
        ...(props.active ? active.root : undefined)
      }}
    >
      {props.leftIcon &&
        React.cloneElement(props.leftIcon, {
          style: {
            width: '16px',
            height: '16px'
          }
        })}
      <Typography
        className={`${classes.text} ${props.className || ''}`}
        variant="body1"
        style={{
          ...variantStyles.text,
          ...(props.active ? active.text : undefined)
        }}
      >
        {props.text}
      </Typography>
      {props.rightIcon &&
        React.cloneElement(props.rightIcon, {
          style: {
            width: '16px',
            height: '16px'
          }
        })}
    </div>
  );
};
