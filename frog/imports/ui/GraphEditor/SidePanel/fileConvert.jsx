// @flow

import React, { Component } from 'react';
import Form from 'react-jsonschema-form';
import CopyToClipboard from 'react-copy-to-clipboard';

class fileConvert extends Component {
  state: { url: string, copied: boolean, display: boolean };

  constructor(props: {}) {
    super(props);
    this.state = { url: '', copied: false, display: false };
  }

  onChange = (e: { formData: { file: string } }) =>
    this.setState({ url: e.formData.file, copied: false });

  onCopy = () => this.setState({ copied: true });

  render() {
    let divForm = null;
    if (!this.state.display) {
      divForm = <div />;
    } else
      divForm = (
        <div>
          <Form
            schema={{
              type: 'object',
              properties: {
                file: {
                  type: 'string',
                  title: 'Upload an image to get its URI'
                }
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
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <CopyToClipboard
              text={this.state.url}
              onCopy={() => this.setState({ copied: true })}
              style={{ height: '39px' }}
            >
              <button>Copy</button>
            </CopyToClipboard>
            <pre style={{ width: '100%' }}>
              {' ' + this.state.url.toString()}
            </pre>
          </div>
        </div>
      );

    return (
      <div>
        <div style={{ width: '100%', height: '2px', background: 'black' }} />
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <h4 style={{ textDecoration: 'underline' }}>
            {' '}File to URL converting tool :{' '}
          </h4>
          <button
            style={{ marginLeft: '20px' }}
            onClick={() => this.setState({ display: !this.state.display })}
          >
            {this.state.display ? 'Close' : 'Open'}
          </button>
        </div>

        {divForm}

      </div>
    );
  }
}

export default fileConvert;
