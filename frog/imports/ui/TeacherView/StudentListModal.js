// @flow

import React from 'react';
import Modal from 'react-modal';
import Form from 'react-jsonschema-form';

import { Sessions } from '../../api/sessions';

const StudentListModal = ({
  dismiss,
  session
}: {
  dismiss: Function,
  session: Object
}) => (
  <Modal isOpen onRequestClose={dismiss} contentLabel="Student list">
    <div className="modal-header">
      <button type="button" className="close" onClick={dismiss}>
        X
      </button>
      <h4 className="modal-title">Edit student list</h4>
      <Form
        formData={{ studentlist: (session.studentlist || []).join('\n') }}
        onSubmit={({ formData }) =>
          Sessions.update(session._id, {
            $set: {
              studentlist: [
                ...new Set(
                  formData.studentlist
                    .split('\n')
                    .map(x => x.trim())
                    .filter(x => x.length > 0)
                    .sort((a, b) => a.localeCompare(b))
                )
              ]
            }
          })}
        schema={{
          type: 'object',
          properties: {
            studentlist: {
              type: 'string',
              title: 'List of students'
            }
          }
        }}
        uiSchema={{
          studentlist: {
            'ui:widget': 'textarea',
            'ui:emptyValue': '',
            'ui:options': {
              rows: 30
            }
          }
        }}
      >
        <button className="btn btn-default" type="submit">
          Save
        </button>
      </Form>
    </div>
  </Modal>
);

export default StudentListModal;
