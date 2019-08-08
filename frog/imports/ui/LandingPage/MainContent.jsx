// @flow
import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import FilterListIcon from '@material-ui/icons/FilterList';
import SearchIcon from '@material-ui/icons/Search';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import  {Typography, Button}  from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(1),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  icons: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'},
  filter: {
    pointer: 'cursor'
  }
}));

type MainContentPropsT = {
  title?: string,
  action?: string, 
  callback?: () => void,
  children: React.Node | React.Node[]
};

const MainContent = ({ children, title,callback,action}: MainContentPropsT) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper} elevation={0}>
            <div className = {classes.icon}>
            <SearchIcon />
           <FilterListIcon className={classes.filter} onClick={handleClick} />
           {action ? <Button color = "primary" onClick = {callback}> {action} </Button> : <></>} 
           </div>
           <Typography variant = "h5">{title}</Typography> 
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Ready</MenuItem>
              <MenuItem onClick={handleClose}>Running</MenuItem>
              <MenuItem onClick={handleClose}>Complete</MenuItem>
            </Menu>
            
          

          </Paper>
        </Grid>
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </div>
  );
};

export default MainContent;
