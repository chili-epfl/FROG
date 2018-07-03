import * as React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Dialog, List, Paper, DialogTitle } from '@material-ui/core';
import { Meteor } from 'meteor/meteor';
import { entries } from 'frog-utils';
import { isEmpty } from 'lodash';

import { activityRunners } from '../../activityTypes';
import { generateDataFn } from './Content';
import { operatorTypesObj } from '../../operatorTypes';

type PropsT = { operatorTypeId: string, config: Object, dismiss: Function };

export class OperatorPreview extends React.Component<
  PropsT,
  { data: *, error: * }
> {
  dataFn: Object;

  constructor(props: PropsT) {
    super(props);
    this.dataFn = generateDataFn();
    Meteor.call(
      'run.operator',
      props.operatorTypeId,
      JSON.parse(JSON.stringify(this.props.config)),
      (err, res) => {
        if (err) {
          this.setState({ error: err });
        } else {
          this.setState({ data: res });
        }
      }
    );
    this.state = { data: {}, error: null };
  }

  render() {
    // $FlowFixMe
    const AT = activityRunners?.['ac-gallery'];
    return AT ? (
      <Dialog open maxWidth="md" fullWidth onClose={this.props.dismiss}>
        <DialogTitle>
          Preview of operator{' '}
          {operatorTypesObj[this.props.operatorTypeId].meta.name}
        </DialogTitle>
        <List>
          {isEmpty(this.state.data) ? (
            <Paper>
              <CircularProgress />
            </Paper>
          ) : (
            <Paper>
              <AT
                activityId="preview1"
                logger={() => {}}
                sessionId="previeww2"
                stream={() => {}}
                userInfo={{ name: 'Preview', id: 'previewe3' }}
                groupingValue="all"
                data={entries(this.state.data.payload.all.data).reduce(
                  (acc, [k, v]) => ({
                    ...acc,
                    [k]: { ...v, votes: {}, categories: [] }
                  }),
                  {}
                )}
                dataFn={this.dataFn}
                activityData={{ config: {}, data: undefined }}
              />
            </Paper>
          )}
        </List>
      </Dialog>
    ) : (
      'Cannot preview if ac-gallery is not installed'
    );
  }
}

export default OperatorPreview;
