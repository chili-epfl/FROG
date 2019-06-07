// @flow
import * as React from 'react';
import { compose } from 'recompose';
import { withRouter } from 'react-router';
import { isEmpty } from 'lodash';
import { TextInput } from 'frog-utils';
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  IconButton
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Frog from '../App/Frog';

type SettingsT = {
  loginByName: boolean,
  secret?: boolean,
  secretString?: string,
  restrictList: boolean,
  studentlist?: string,
  allowLateLogin?: boolean,
  tooLate?: boolean
};

type WikiLoginProps = {
  login: Function,
  settings: SettingsT 
}; 

type State = {
    secret: string, 
    name: string 
}

const mainContent = {
   width: '100%',
   marginTop: 65

}; 

const container = {
    width: '100%',
    overflow: 'auto',
    marginLeft: 10
}; 

const loginButton ={ marginLeft: 10 }; 



// still work in progress. 

export default class WikiLogin  extends React.Component<WikiLoginProps,State> {

    state = {
        name: '', 
        secret:''
    }

    constructor(props){
        super(props); 
    }




    login = () => {
    const settings = this.props.settings;
    if (
      settings.secret &&
      settings.secretString &&
      !isEmpty(settings.secretString)
    ) {
      if (
        !this.state.secret ||
        settings.secretString.trim().toUpperCase() !==
          (this.state.secret && this.state.secret.trim().toUpperCase())
      ) {
        // eslint-disable-next-line no-alert
        return window.alert('Secret token is not correct');
      }
    }
    this.props.login({
      username:
      (this.state.name && this.state.name.trim()),
      isStudentList: true
    });
  };

    render(){
         return (

            <div className = {container}>
            <h1> Hello {console.log(this.props.settings)} </h1>

            <div className = {mainContent}>
             <b>Enter your name to login as a new user</b>
                       
                        <b>Enter your name to login as a new user</b>
                        <br />
                        <TextInput
                          focus={false}
                          onChange={e => this.setState({ name: e })}
                        />
            </div>


          
              <Button
                onClick={this.login}
                style = {loginButton}
                variant="contained"
                color="primary"
                disabled={
                  isEmpty(this.state.name)}
                 
              >
                Log in
              </Button>
           </div>
            );
      
   
    

   }
}
