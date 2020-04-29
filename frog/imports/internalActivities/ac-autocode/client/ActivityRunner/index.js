// @flow

import * as React from 'react';
import { type ActivityRunnerPropsT } from '/imports/frog-utils';
import { withStyles } from '@material-ui/core/styles';

import Header from './Header';
import Editor from './Editor';
import TestPanel from './TestPanel';
import makeRunCode from './MakeRunCode';
import HTMLrenderer from './HTMLrenderer';

const styles = {
  root: {
    height: '100%',
    width: '100%',
    overflow: 'auto'
  },
  main: {
    display: 'flex',
    flexFlow: 'row wrap'
  }
};

class ActivityRunner extends React.Component<
  ActivityRunnerPropsT & { classes: Object }
> {
  runCode: Function;

  handleError: Function;

  componentDidMount() {
    const { language } = this.props.activityData.config;
    if (language === 'python' || language === 'javascript') {
      const { runCode, handleError } = makeRunCode(language);
      this.runCode = runCode;
      this.handleError = handleError;
      this.forceUpdate();
    }
  }

  render() {
    const { classes, ...props } = this.props;
    const { config } = props.activityData;
    const { code } = props.data;
    return (
      <div className={classes.root}>
        <Header config={config} />
        <div className={classes.main}>
          <Editor {...props} />
          {config.language !== 'HTML' && (
            <TestPanel
              tests={config.tests}
              runCode={this.runCode}
              handleError={this.handleError}
              // $FlowFixMe
              {...props}
            />
          )}
          {config.language === 'HTML' && <HTMLrenderer code={code} />}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(ActivityRunner);
