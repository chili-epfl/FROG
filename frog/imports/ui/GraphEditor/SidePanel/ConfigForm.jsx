// @flow

import React, { Component } from 'react';

import { EnhancedForm } from 'frog-utils';
import { addOperator, addActivity } from '/imports/api/activities';

import {
  SelectFormWidget,
  SelectActivityWidget,
  addSocialFormSchema
} from './FormUtils';

type PropT = Object;

export default class ConfigForm extends Component {
  state: Object;

  constructor(props: PropT) {
    super(props);
    this.state = this.getState(props);
  }

  getState(props: PropT) {
    const {
      node,
      nodeType,
      valid,
      connectedActivities,
      refreshValidate
    } = props;
    return {
      formData: node.data,
      ...addSocialFormSchema(nodeType.config, nodeType.configUI),
      widgets: {
        socialAttributeWidget: SelectFormWidget,
        activityWidget: SelectActivityWidget
      },
      formContext: {
        options: valid.social[node._id] || [],
        connectedActivities,
        groupingKey: node.groupingKey
      },
      onChange: data => {
        if (node.operatorType) {
          addOperator(node.operatorType, data.formData, node._id);
        } else {
          addActivity(node.activityType, data.formData, node._id, null);
        }
        refreshValidate();
      }
    };
  }

  componentWillReceiveProps(nextProps: PropT) {
    this.setState(this.getState(nextProps));
  }

  // credit to Stian Håklev
  shouldComponentUpdate(nextProps: PropT) {
    return this.props.node._id !== nextProps.node._id;
  }

  render() {
    const nodeConfig = this.props.nodeType.config;
    return nodeConfig && ![{}, undefined].includes(nodeConfig.properties)
      ? <EnhancedForm showErrorList={false} noHtml5Validate {...this.state}>
          <div />
        </EnhancedForm>
      : null;
  }
}
