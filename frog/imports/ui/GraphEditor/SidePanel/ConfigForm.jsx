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
  // credit to Stian Håklev
  shouldComponentUpdate(nextProps: PropT) {
    let should = false;
    // form must be refreshed when control operators change the applytoall value
    if (this.props.nodeType.type === 'control') {
      const thisData = this.props.node.data || {};
      const nextData = nextProps.node.data || {};
      should = should || thisData.applytoall !== nextData.applytoall;
    }
    // form must update if another ac/op is selected
    should = should || this.props.node._id !== nextProps.node._id;

    return should;
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

    const nodeConfig = this.props.nodeType.config;
    return nodeConfig && ![{}, undefined].includes(nodeConfig.properties)
      ? <EnhancedForm showErrorList={false} noHtml5Validate {...props}>
          <div />
        </EnhancedForm>
      : null;
  }
}
