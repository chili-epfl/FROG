// @flow

import * as React from 'react';
import ClearIcon from '@material-ui/icons/Clear';

const drawingItemsStyle = {
  width: '15%',
  minWidth: '125px',
  display: 'flex',
  flexDirection: 'row'
};

const toolbarStyle = {
  minHeight: '50px',
  paddingTop: '5px',
  borderBottom: '1px solid lightblue',
  marginBottom: '5px'
};

const ColorOptions = [
  ['#FFFFFF', 'White'],
  ['#FFFF00', 'Yellow'],
  ['#FF0000', 'Red'],
  ['#0000FF', 'Blue'],
  ['#32CD32', 'Green']
];

export default ({ selectPenColor, data, disableNone = true }: Object) => {
  const colorOptions = ColorOptions.map(colorOption => {
    const color = colorOption[0];
    const style = {
      background: color,
      color: colorOption[1] === 'White' ? 'black' : 'white',
      width: '16px',
      height: '16px',
      borderRadius: '8px',
      border: 'none'
    };
    if (disableNone && colorOption[1] === 'White') return null;
    return (
      <div
        key={'penColor' + color}
        style={{
          width: '19px',
          height: '19px',
          border: 'solid 1px',
          borderColor: data.currentColor === color ? 'black' : 'white',
          margin: '2px'
        }}
      >
        {colorOption[1] === 'White' ? (
          <ClearIcon onClick={() => selectPenColor(color)} style={style} />
        ) : (
          <button onClick={() => selectPenColor(color)} style={style} />
        )}
      </div>
    );
  });
  return (
    <div style={toolbarStyle}>
      <div style={drawingItemsStyle}>{colorOptions}</div>
    </div>
  );
};
