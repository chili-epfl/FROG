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
  state: { formData: Object };

  constructor(props: PropT) {
    super(props);
    this.state = { formData: this.props.node.data };
  }

  componentWillReceiveProps(nextProps: PropT) {
    if (this.props.node._id !== nextProps.node._id) {
      this.setState({ formData: nextProps.node.data });
    }
  }

  shouldComponentUpdate(nextProps: PropT): boolean {
    if (this.props.node._id === nextProps.node._id) {
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

    const nodeConfig = this.props.nodeType.config;
    return nodeConfig && ![{}, undefined].includes(nodeConfig.properties) ? (
      <EnhancedForm showErrorList={false} noHtml5Validate {...props}>
        <div />
      </EnhancedForm>
    ) : null;
  }
}
