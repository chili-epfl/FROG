// @flow

import React, { Component } from 'react';
import Form from 'react-jsonschema-form';

class UploadFile extends Component {
  state: { url: string };

  constructor(props: {}) {
    super(props);
    this.state = { url: '' };
  }

  processFile(files: Array<any>) {
    const f = files[0];
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = event => resolve(event.target.result);
      reader.readAsDataURL(f);
    });
  }

  onChange = (e: { formData: { file: string } }) =>
    this.setState({ url: e.formData.file });

  render() {
    return (
      <div>
        <div style={{ width: '100%', height: '2px', background: 'black' }} />
        <h4 style={{ textDecoration: 'underline' }}> Uploading file tool </h4>
        <Form
          schema={{
            type: 'object',
            properties: {
              file: { type: 'string', title: 'Upload image to get the URI' }
            }
          }}
          uiSchema={{
            file: {
              'ui:widget': 'file'
            }
          }}
          onChange={this.onChange}
          liveValidate
        >
          <div />
        </Form>
        <h4>Submitted file as data URL</h4>
        <pre>{this.state.url.toString()}</pre>
      </div>
    );
  }
}

export default UploadFile;
