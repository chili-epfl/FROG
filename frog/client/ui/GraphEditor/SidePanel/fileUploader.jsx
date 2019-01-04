// @flow

import React, { Component } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Collapse } from 'react-bootstrap';
import Dropzone from 'react-dropzone';

import { uuid } from 'frog-utils';
import { uploadFile } from '../../../api/openUploads';

const Header = ({ display, setState }) => (
  <div style={{ display: 'flex', flexDirection: 'row' }}>
    <span
      className={'glyphicon glyphicon-' + (display ? 'menu-up' : 'menu-down')}
      aria-hidden="true"
      style={{ fontSize: '200%', marginLeft: '10px', marginTop: '5px' }}
      onClick={() => setState({ display: !display })}
    />
    <h4 style={{ textDecoration: 'underline', margin: '10px' }}>
      Upload File:
    </h4>
  </div>
);

const FileBox = ({ urls, setState }) => {
  const onDropRecursive = (files, i, newUrls) => {
    if (i >= files.length) {
      setState({ urls: [...urls, ...newUrls] });
    } else {
      const fileId = uuid();
      uploadFile(files[i], fileId).then(newUrl => {
        onDropRecursive(files, i + 1, [...newUrls, newUrl]);
      });
    }
  };

  const onDrop = files => onDropRecursive(files, 0, []);

  return (
    <Dropzone
      onDrop={onDrop}
      style={{
        width: '100%',
        height: '100px',
        borderWidth: '2px',
        borderColor: 'rgb(102, 102, 102)',
        borderStyle: 'dashed',
        borderRadius: '5px',
        textAlign: 'center'
      }}
    >
      <h3
        style={{
          position: 'relative',
          top: '50%',
          transform: 'translateY(-50%)',
          margin: '0 auto'
        }}
      >
        Drop files here
      </h3>
    </Dropzone>
  );
};

const FileList = ({ urls }) =>
  urls && urls.length > 0 ? (
    <div>
      <h4>URL of submitted files</h4>
      {urls.map(url => (
        <div key={url} style={{ display: 'flex', flexDirection: 'row' }}>
          <CopyToClipboard text={url} style={{ height: '39px' }}>
            <button>Copy</button>
          </CopyToClipboard>
          <pre style={{ width: '100%' }}>{url}</pre>
        </div>
      ))}
    </div>
  ) : (
    <h4>No uploaded file</h4>
  );

type FileUploaderStateT = { urls: string[], display: boolean };

class fileUploader extends Component<Object, FileUploaderStateT> {
  mounted: boolean;

  constructor(props: Object) {
    super(props);
    this.state = { urls: [], display: false };
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    return (
      <div>
        <div style={{ width: '100%', height: '2px', background: 'black' }} />
        <Header
          display={this.state.display}
          setState={state => this.mounted && this.setState(state)}
        />
        <Collapse in={this.state.display}>
          <div>
            <FileBox
              urls={this.state.urls}
              setState={state => this.mounted && this.setState(state)}
            />
            <FileList urls={this.state.urls} />
          </div>
        </Collapse>
      </div>
    );
  }
}

export default fileUploader;
