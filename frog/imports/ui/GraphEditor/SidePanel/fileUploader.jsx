// @flow

import React, { Component } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Collapse } from 'react-bootstrap';
import Dropzone from 'react-dropzone';

import { Uploads } from '../../../api/uploads';

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
  const onDrop = files => {
    if (files.length > 1) {
      window.alert('Only 1 file at a time please'); //eslint-disable-line
    } else {
      Uploads.insert(files[0], (err, fileObj) => {
        const newUrl =
          window.location.origin + '/cfs/files/uploads/' + fileObj._id;
        setState({
          urls: [...urls, newUrl]
        });
      });
    }
  };

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

class fileUploader extends Component {
  state: { urls: string[], display: boolean };
  mounted: boolean;

  constructor(props: {}) {
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
