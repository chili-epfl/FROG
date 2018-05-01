import * as React from 'react';
import { EnhancedForm } from 'frog-utils';
import Dialog from 'material-ui/Dialog';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from 'material-ui/transitions/Slide';
import List from 'material-ui/List';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import styles from './styles';
import { Sessions } from '../../api/sessions';

const cleanStudentList = studentList =>
  studentList
    ? [
        ...new Set(
          studentList
            .split('\n')
            .map(x => x.trim())
            .filter(x => x.length > 0)
            .sort((a, b) => a.localeCompare(b))
        )
      ].join('\n')
    : '';

const updateSession = (settings, session) => {
  if (settings) {
    Sessions.update(session._id, {
      $set: {
        settings: {
          ...settings,
          studentlist: cleanStudentList(settings.studentlist)
        }
      }
    });
  }
};

const Transition = props => <Slide direction="up" {...props} />;

class SettingsModal extends React.Component {
  state = {
    settings: this.props.session.settings
  };

  render() {
    const { onClose, classes } = this.props;
    return (
      <Dialog open onClose={onClose} transition={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton color="inherit" onClick={onClose} aria-label="Close">
              <CloseIcon />
            </IconButton>
            <Typography
              variant="title"
              color="inherit"
              className={classes.flex}
            >
              Configure Settings
            </Typography>
            <Button color="inherit" onClick={onClose}>
              save
            </Button>
          </Toolbar>
        </AppBar>
        <List>
          <div className="bootstrap">
            <EnhancedForm
              formData={this.state.settings}
              onChange={({ formData: f }) => {
                this.setState({ settings: f });
                this.formData = f;
                updateSession(f, this.props.session);
              }}
              onSubmit={({ formData: f }) => {
                updateSession(f, this.props.session);
                this.formData = {
                  ...this.formData,
                  studentlist: cleanStudentList(this.formData.studentlist)
                };
              }}
              schema={{
                type: 'object',
                properties: {
                  allowLTI: {
                    type: 'boolean',
                    default: true,
                    title: 'Allow LTI login'
                  },
                  loginByName: {
                    type: 'boolean',
                    title: 'Allow login by name'
                  },
                  secret: {
                    type: 'boolean',
                    title: 'Require students to provide secret string to log in'
                  },
                  secretString: { type: 'string', title: 'Secret string' },
                  specifyName: {
                    type: 'boolean',
                    title:
                      'Allow students to specify their own name, not already on the list below'
                  },
                  studentlist: {
                    type: 'string',
                    title:
                      'Optionally provide a list of student names (one name per line)'
                  }
                }
              }}
              uiSchema={{
                studentlist: {
                  'ui:widget': 'textarea',
                  'ui:emptyValue': '',
                  'ui:options': {
                    rows: 15
                  },
                  conditional: 'loginByName'
                },
                specifyName: {
                  conditional: 'loginByName'
                },
                secret: {
                  conditional: 'loginByName'
                },
                secretString: {
                  conditional: formdata =>
                    formdata.secret && formdata.loginByName
                }
              }}
            >
              &nbsp;
            </EnhancedForm>
          </div>
        </List>
      </Dialog>
    );
  }
}

SettingsModal.displayName = 'SettingsModal';
export default withStyles(styles)(SettingsModal);
