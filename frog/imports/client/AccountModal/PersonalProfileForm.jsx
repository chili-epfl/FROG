
import * as React from 'react';
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import { Create } from "@material-ui/icons";
import {getUsername,getEmail} from '/imports/api/users'; 

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%'
    }, 
    paper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: "33.33%",
        flexShrink: 0
      },
      secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary
      }
  }));

export const PersonalProfileForm = ({openDisplayNameForm, openPasswordForm}) => {
    const classes = useStyles(); 
return (
    <Container component="main"maxWidth="lg">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant="h5" gutterBottom >
           Personal Profile
        </Typography>
        <Typography variant="subtitle1" align = "center" gutterBottom >
           Basic info like your display name, email and password that you use in FROG 
        </Typography>
         <div className = {classes.root}>
        <ExpansionPanel expanded = {false}>
        <ExpansionPanelSummary
          expandIcon={<Create />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
          onClick={openDisplayNameForm}
        >
          <Typography className={classes.heading}>Display Name</Typography>
          <Typography className={classes.secondaryHeading}>{getUsername()}</Typography>
        </ExpansionPanelSummary>
      </ExpansionPanel>
      <ExpansionPanel expanded = {false}>
        <ExpansionPanelSummary
          expandIcon={<Create />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
          onClick={openPasswordForm} 
        >
          <Typography className={classes.heading}>Password </Typography>
          <Typography className={classes.secondaryHeading}>********</Typography>
        </ExpansionPanelSummary>
      </ExpansionPanel>
      <ExpansionPanel expanded = {false}>
        <ExpansionPanelSummary
          expandIcon={<Create />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography className={classes.heading}>Email</Typography>
          <Typography className={classes.secondaryHeading}>{getEmail()}</Typography>
        </ExpansionPanelSummary>
      </ExpansionPanel>
      </div>
       
     
      </div>
    </Container>
  );}