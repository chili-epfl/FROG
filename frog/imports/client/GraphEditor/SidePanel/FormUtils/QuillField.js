// @flow

import React from 'react';
import { ReactiveRichText } from 'frog-utils';
import { generateReactiveFn } from '/imports/api/generateReactiveFn';
import { connection } from '/imports/client/App/connection';

const doc = connection.get('li', 1);
const dataFn = generateReactiveFn(doc);

export default class RichText extends React.Component<*, *> {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const {
      onChange,
      value = JSON.stringify({ ops: [{ insert: '\n' }] })
    } = this.props;
    return (
      <div>
        <ReactiveRichText
          rawData={JSON.parse(value)}
          onChange={(_, _1, source, editor) => {
            if (source === 'user') {
              onChange(JSON.stringify(editor.getContents()));
            }
          }}
          dataFn={dataFn}
        />
      </div>
    );
  }
}
