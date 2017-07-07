// @flow

import React, { Component } from 'react';
import Form from 'react-jsonschema-form';
import CopyToClipboard from 'react-copy-to-clipboard';

class fileConvert extends Component {
  state: { url: string, copied: boolean };

  constructor(props: {}) {
    super(props);
    this.state = { url: '', copied: false };
  }

  onChange = (e: { formData: { file: string } }) =>
    this.setState({ url: e.formData.file, copied: false });

    onCopy = () => this.setState({copied: true});

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
        <div style={{display: 'flex', flexDirection: 'row'}}>
        <CopyToClipboard text={this.state.url}
          onCopy={() => this.setState({copied: true})}
        style={{height: '39px'}}>
          <button>Copy</button>
        </CopyToClipboard>
        <pre style={{width: '100%'}}>{' '+this.state.url.toString()}</pre>
        </div>
      </div>
    );
  }
}

export default fileConvert;
