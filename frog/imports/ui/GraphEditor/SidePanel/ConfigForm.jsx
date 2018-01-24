// @flow

import React, { Component } from 'react';
import { EnhancedForm } from 'frog-utils';
import { isEqual } from 'lodash';

import { Activities, addOperator, addActivity } from '/imports/api/activities';

import {
  SelectFormWidget,
  SelectActivityWidget,
  addSocialFormSchema
} from './FormUtils';

type PropT = Object;

export default class ConfigForm extends Component {
  state: { formData: Object };

  constructor(props: PropT) {
    super(props);
    this.state = { formData: this.props.node.data };
  }

  componentWillReceiveProps(nextProps: PropT) {
    if (
      this.props.node._id !== nextProps.node._id ||
      this.props.reload !== nextProps.reload
    ) {
      this.setState({ formData: Activities.findOne(nextProps.node._id).data });
    }
  }

  shouldComponentUpdate(nextProps: PropT): boolean {
    if (
      this.props.node._id === nextProps.node._id &&
      this.props.reload === nextProps.reload &&
      isEqual(this.props.connectedActivities, nextProps.connectedActivities)
    ) {
      return false;
    } else {
      return true;
    }
  }

  render() {
    const {
      node,
      nodeType,
      valid,
      connectedActivities,
      refreshValidate
    } = this.props;
    const props = {
      formData: this.state.formData,
      ...addSocialFormSchema(nodeType.config, nodeType.configUI),
      widgets: {
        ...this.props.widgets,
        socialAttributeWidget: SelectFormWidget,
        activityWidget: SelectActivityWidget
      },
      reload: this.props.reload,
      id: node._id,
      formContext: {
        options: valid.social[node._id] || [],
        connectedActivities,
        groupingKey: node.groupingKey
      },
      onChange:
        this.props.onChange ||
        (data => {
          if (node.operatorType) {
            addOperator(node.operatorType, data.formData, node._id);
          } else {
            addActivity(node.activityType, data.formData, node._id, null);
          }
          refreshValidate();
        })
    };

    const nodeConfig = this.props.nodeType.config;
    return nodeConfig && ![{}, undefined].includes(nodeConfig.properties) ? (
      <EnhancedForm showErrorList={false} noHtml5Validate {...props}>
        <div />
      </EnhancedForm>
    ) : null;
  }
}
