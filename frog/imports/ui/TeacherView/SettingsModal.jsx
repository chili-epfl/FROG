// @flow

import * as React from 'react';
import Modal from 'react-modal';
import { EnhancedForm } from 'frog-utils';

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

type PropsT = {
  dismiss: Function,
  session: Object
};

class SettingsModal extends React.Component<PropsT, void> {
  formData: Object;

  constructor(props: PropsT) {
    super(props);
    this.formData = this.props.session.settings;
  }

  shouldComponentUpdate(): boolean {
    return false;
  }

  render() {
    return (
      <Modal
        isOpen
        onRequestClose={this.props.dismiss}
        contentLabel="Student list"
      >
        <div className="modal-header">
          <button
            type="button"
            className="close"
            onClick={() => {
              updateSession(this.formData, this.props.session);
              this.props.dismiss();
            }}
          >
            X
          </button>
          <h4 className="modal-title">Configure session</h4>
          <EnhancedForm
            formData={this.props.session.settings}
            onChange={({ formData: f }) => {
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
                loginByName: { type: 'boolean', title: 'Allow login by name' },
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
                conditional: formdata => formdata.secret && formdata.loginByName
              }
            }}
          >
            <button className="btn btn-default" type="submit">
              Save
            </button>
          </EnhancedForm>
        </div>
      </Modal>
    );
  }
}

SettingsModal.displayName = 'SettingsModal';
export default SettingsModal;
