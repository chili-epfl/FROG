// @flow

import React from 'react';
import { withStyles } from '@material-ui/styles';
import Markdown from 'markdown-to-jsx';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { type ActivityPackageT, type ActivityDbT } from '/imports/frog-utils';
import ApiForm from '../GraphEditor/SidePanel/ApiForm';
import { type PropsT } from './types';
import { style } from './style';

/**
 * The final screen displayed after the creation of a single activity.
 * @param {ActivityPackageT} activityType - The object containing the details of the activity to be configured
 * @param {Function} onSubmit - Callback function for handling the 'Submit' button
 * @param {Function} onReturn - Callback function for handling the 'Back' button
 */
class ConfigPanel extends React.Component<
  {
    name: string,
    activityType: ActivityPackageT,
    onSubmit: Function,
    onReturn: Function,
    data?: Object
  } & PropsT,
  { activity?: ActivityDbT }
> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { id } = this.props.activityType;
    const { classes, data } = this.props;
    return (
      <Card raised className={classes.card}>
        <Typography variant="h5" component="h2">
          <IconButton
            onClick={() => this.props.onReturn()}
            className={classes.back_button}
          >
            <ArrowBack />
          </IconButton>
          {this.props.activityType?.type === 'template'
            ? `Create a lesson plan based on the ${this.props.activityType?.meta
                ?.name || ''}`
            : `Edit ${this.props.activityType?.meta?.name || ''}`}
        </Typography>
        <Typography variant="body1" style={{ padding: '20px' }}>
          <Markdown>
            {this.props.activityType?.meta?.description ||
              this.props.activityType?.meta?.shortDesc}
          </Markdown>
        </Typography>
        <ApiForm
          activityType={id}
          config={data}
          onConfigChange={x => this.setState({ activity: x })}
          hidePreview
          noOffset
        />
        <CardActions>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => this.props.onSubmit(this.state.activity)}
            disabled={
              this.state.activity?.errors &&
              !!this.state.activity?.errors.length
            }
          >
            Publish
          </Button>
        </CardActions>
      </Card>
    );
  }
}
export default withStyles(style)(ConfigPanel);
