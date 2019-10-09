// @flow

import * as React from 'react';

import { ReactJsonView } from './browserOnlyComponents';

const abc = 'abc';

export const Inspector = ({ data }: { data: Object | Object[] }) =>
  data ? (
    <ReactJsonView
      name={false}
      style={{ fontSize: '1.2em' }}
      src={data}
      iconStyle="triangle"
      enableClipboard={false}
      displayObjectSize={false}
      displayDataTypes={false}
      theme={{
        base00: '#fafafa',
        base01: '#f0f0f1',
        base02: '#e5e5e6',
        base03: '#a0a1a7',
        base04: '#696c77',
        base05: '#383a42',
        base06: '#202227',
        base07: '#090a0b',
        base08: '#ca1243',
        base09: '#d75f00',
        base0A: '#c18401',
        base0B: '#50a14f',
        base0C: '#0184bc',
        base0D: '#4078f2',
        base0E: '#a626a4',
        base0F: '#986801'
      }}
    />
  ) : null;
