import React from 'react';

const style = {
  flex: '1 0 360px',
  border: '2px solid black',
  height: '420px',
  overflow: 'auto',
  padding: '4px'
};

export default ({ code }) => (
  <div style={style} dangerouslySetInnerHTML={{ __html: code }} />
);
