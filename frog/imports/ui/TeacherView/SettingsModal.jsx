import * as React from 'react';
import { EnhancedForm } from 'frog-utils';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import List from '@material-ui/core/List';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
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

class SettingsModal extends React.Component {
  state = {
    settings: this.props.session.settings
  };

  render() {
    const { onClose, classes } = this.props;
    return (
      <Dialog className={classes.maybeZoom} open onClose={onClose}>
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
                    title: `Optionally provide a list of student names (one name per line) (these students won't be auto-joined to the session until you perform a session restart`
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
