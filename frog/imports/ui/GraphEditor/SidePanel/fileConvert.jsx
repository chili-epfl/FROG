// @flow

import React, { Component } from 'react';
import Form from 'react-jsonschema-form';
import CopyToClipboard from 'react-copy-to-clipboard';

import { Uploads } from '/imports/api/uploads';

class fileConvert extends Component {
  state: { url: string, copied: boolean, display: boolean };

  constructor(props: {}) {
    super(props);
    this.state = { url: '', copied: false, display: false };
  }

  onChange = (e: { formData: { file: string } }) => {
    const that = this;
    Uploads.insert(e.formData.file, (err, fileObj) => {
      that.setState({
        url: window.location.origin + '/cfs/files/uploads/' + fileObj._id,
        copied: false
      });
    });
  };

  onCopy = () => this.setState({ copied: true });

  render() {
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
        {this.state.display &&
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
            <h4>{'Submitted file as data URL'}</h4>
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
          </div>}
      </div>
    );
  }
}

export default fileConvert;
