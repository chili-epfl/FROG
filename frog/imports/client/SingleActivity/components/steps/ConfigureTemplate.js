// @flow

import * as React from 'react';
import Markdown from 'markdown-to-jsx';

import { Typography } from '@material-ui/core';

import { SplitLayout } from '../ui/SplitLayout';

type ConfigureTemplatePropsT = {
  name: string,
  shortDesc: string,
  description: string,
  children: React.Element<*>
};

export const ConfigureTemplate = (props: ConfigureTemplatePropsT) => (
  <>
    <Typography
      variant="h2"
      style={{
        marginBottom: '32px',
        textAlign: 'center',
        fontSize: '2.5em'
      }}
    >
      Configure {props.name}
    </Typography>
    <Typography
      variant="body2"
      style={{
        marginBottom: '32px',
        textAlign: 'center'
      }}
    >
      {props.shortDesc}
    </Typography>
    <SplitLayout
      left={props.children}
      right={
        <>
          <Typography
            variant="h2"
            style={{
              marginBottom: '8px',
              textAlign: 'center',
              fontSize: '1.2em'
            }}
          >
            {props.name}
          </Typography>
          <Typography variant="body2">
            <Markdown>{props.description || props.shortDesc}</Markdown>
          </Typography>
        </>
      }
      size={3}
    />
  </>
);
