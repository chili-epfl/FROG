// @flow

import * as React from 'react';

import { EnhancedForm } from '/imports/frog-utils';
import { Modal } from '/imports/ui/Modal';

const schema = {
  type: 'object',
  properties: {
    allowLTI: {
      type: 'boolean',
      default: true,
      title: 'Allow LTI login'
    },
    allowLateLogin: {
      type: 'boolean',
      title:
        'Allow late login (only if you are really sure, could crash FROG for the late students'
    },
    loginByName: {
      type: 'boolean',
      title: 'Allow login by name',
      default: true
    },
    secret: {
      type: 'boolean',
      title: 'Require students to provide secret string to log in'
    },
    secretString: { type: 'string', title: 'Secret string' },
    restrictList: {
      type: 'boolean',
      title: 'Restrict students to the names already listed below'
    },
    studentlist: {
      type: 'string',
      title: `Optionally provide a list of student names (one name per line) (these students won't be auto-joined to the session until you perform a session restart`
    }
  }
};

const uiSchema = {
  studentlist: {
    'ui:widget': 'textarea',
    'ui:emptyValue': '',
    'ui:options': {
      rows: 15
    },
    conditional: 'loginByName'
  },
  restrictList: {
    conditional: 'loginByName'
  },
  secret: {
    conditional: 'loginByName'
  },
  secretString: {
    conditional: formdata => formdata.secret && formdata.loginByName
  }
};

type SettingsModalPropsT = {
  currentSettings: Object,
  onChange: (settings: Object) => void
};

export const SettingsModal = (props: SettingsModalPropsT) => {
  return (
    <Modal
      title=" Configure settings"
      actions={hideModal => [
        {
          title: 'Close',
          callback: () => {
            hideModal();
          }
        }
      ]}
    >
      <div className="bootstrap">
        <EnhancedForm
          formData={props.currentSettings}
          onChange={({ formData: f }) => {
            props.onChange(f);
          }}
          schema={schema}
          uiSchema={uiSchema}
        >
          &nbsp;
        </EnhancedForm>
      </div>
    </Modal>
  );
};
