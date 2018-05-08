// @flow

import * as React from 'react';

export const Highlight = (props: { text: string, searchStr: string }) => {
  if (!props.text.toLowerCase().includes(props.searchStr))
    return <React.Fragment>{props.text}</React.Fragment>;
  else {
    const index1 = props.text.toLowerCase().indexOf(props.searchStr);
    const index2 = index1 + props.searchStr.length;
    const tmp = props.text.substring(index1, index2);

    return (
      <React.Fragment>
        {props.text.substring(0, index1)}
        <span style={{ backgroundColor: '#FFFF00' }}>{tmp}</span>
        {props.text.substring(index2)}
      </React.Fragment>
    );
  }
};
