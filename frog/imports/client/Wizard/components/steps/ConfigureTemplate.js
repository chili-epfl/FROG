// @flow

import * as React from 'react';
import Markdown from 'markdown-to-jsx';

import { Typography, makeStyles } from '@material-ui/core';

import { SplitLayout } from '../ui/SplitLayout';

const useStyle = makeStyles(() => ({
  title: {
    marginBottom: '16px',
    textAlign: 'center',
    fontSize: '2.5em'
  },
  description: {
    marginBottom: '32px',
    textAlign: 'center'
  },
  docTitle: {
    marginBottom: '8px',
    textAlign: 'center',
    fontSize: '1.2em'
  },
  docContent: {
    '& img': {
      maxWidth: '100%'
    }
  }
}));

type ConfigureTemplatePropsT = {
  name: string,
  shortDesc: string,
  description: string,
  children: React.Element<*>
};

export const ConfigureTemplate = (props: ConfigureTemplatePropsT) => {
  const classes = useStyle();
  return (
    <>
      <Typography className={classes.title} variant="h4">
        Configure {props.name}
      </Typography>
      <Typography className={classes.description} variant="body1">
        {props.shortDesc}
      </Typography>
      <SplitLayout
        left={props.children}
        right={
          <>
            <Typography className={classes.docTitle} variant="h2">
              {props.name}
            </Typography>
            <Typography
              className={classes.docContent}
              variant="body2"
              component="div"
            >
              <Markdown>{props.description || props.shortDesc}</Markdown>
            </Typography>
          </>
        }
        rightPanelSize="300px"
      />
    </>
  );
};
