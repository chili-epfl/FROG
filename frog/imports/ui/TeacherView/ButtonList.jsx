// @flow

import React from 'react';
import { Link } from 'react-router-dom';

import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import classNames from 'classnames';
import Paper from 'material-ui/Paper';
import Grow from 'material-ui/transitions/Grow';

import { MenuList, MenuItem } from 'material-ui/Menu';

import { withStyles } from 'material-ui/styles';

import { Manager, Target, Popper } from 'react-popper';
import ClickAwayListener from 'material-ui/utils/ClickAwayListener';

import MoreVertIcon from 'material-ui-icons/MoreVert';
import Tooltip from 'material-ui/Tooltip';

const styles = () => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    padding: 0,
    margin: 0
  },
  popperClose: {
    pointerEvents: 'none'
  },
  sessionButton: {
    padding: 0,
    margin: 0,
    minWidth: 35
  },
  button: {
    margin: 0
  },
  paperCenter: {
    textAlign: 'center',
    verticalAlign: 'middle',
    margin: 0,
    padding: 0
  },
  paperRight: {
    padding: 0,
    margin: 0,
    textAlign: 'right',
    verticalAlign: 'top'
  },
  zero: {
    padding: 0,
    textAlign: 'center'
  }
});

@withStyles(styles)
export class SessionTitle extends React.Component {
  state = {
    open: false
  };

  handleClick = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, session, buttons } = this.props;
    const { open } = this.state;
    return (
      <div className={classes.root}>
        <Grid
          container
          className={classes.root}
          justify="space-between"
          containerspacing={0}
        >
          <Grid item xs className={classes.zero} />
          <Grid
            id="center-item"
            item
            xs={6}
            style={{ padding: 0, textAlign: 'center' }}
          >
            <Tooltip
              id="tooltip-top"
              title="active session link"
              placement="top"
            >
              <Button
                color="primary"
                component={Link}
                to={`/${session.slug}`}
                className={classes.button}
              >
                Current Session: {session.slug}
              </Button>
            </Tooltip>
          </Grid>
          <Grid
            item
            xs
            className={classes.zero}
            style={{ padding: 0, textAlign: 'right' }}
          >
            <Manager>
              <Target>
                <Tooltip
                  id="tooltip-top"
                  title="session actions"
                  placement="top"
                >
                  <Button
                    aria-owns={open ? 'menu-list' : null}
                    aria-haspopup="true"
                    onClick={this.handleClick}
                    color="primary"
                    className={classes.sessionButton}
                  >
                    <MoreVertIcon />
                  </Button>
                </Tooltip>
              </Target>
              <Popper
                placement="bottom-start"
                eventsEnabled={open}
                className={classNames({ [classes.popperClose]: !open })}
              >
                <ClickAwayListener onClickAway={this.handleClose}>
                  <Grow
                    in={open}
                    id="menu-list"
                    style={{ transformOrigin: '0 0 0' }}
                  >
                    <Paper>
                      <MenuList role="menu">
                        {buttons
                          .filter(button => button.source === 'menu')
                          .map(button => (
                            <MenuItem
                              key={button.text}
                              onClick={() => {
                                button.onClick();
                                this.handleClose();
                              }}
                              id={button.text}
                            >
                              {button.text}
                            </MenuItem>
                          ))}
                      </MenuList>
                    </Paper>
                  </Grow>
                </ClickAwayListener>
              </Popper>
            </Manager>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const ButtonList = ({
  session,
  buttons,
  ...props
}: {
  session: Object,
  toggle: Function,
  setShowStudentList: Function
}) => {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <SessionTitle session={session} buttons={buttons} {...props} />
    </div>
  );
};

export default withStyles(styles)(ButtonList);
