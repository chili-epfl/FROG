// @flow

import React, { Component } from 'react';

import { EnhancedForm } from 'frog-utils';
import { addOperator } from '/imports/api/activities';

import addSocialFormSchema from './ActivityPanel/addSocialSchema';
import { SelectFormWidget, SelectActivityWidget } from './FormWidgets';

type PropT = Object;

export default class ConfigForm extends Component {
  state: Object;

  constructor(props: PropT) {
    super(props);
    this.state = this.getState(props);
  }

  getState(props: PropT) {
    const {
      operator,
      operatorType,
      valid,
      connectedActivities,
      refreshValidate
    } = props;
    return {
      formData: operator.data,
      ...addSocialFormSchema(operatorType.config, operatorType.configUI),
      widgets: {
        socialAttributeWidget: SelectFormWidget,
        activityWidget: SelectActivityWidget
      },
      formContext: {
        options: valid.social[operator._id] || [],
        connectedActivities
      },
      onChange: data => {
        addOperator(operator.operatorType, data.formData, operator._id);
        refreshValidate();
      }
    };
  }

  componentWillReceiveProps(nextProps: PropT) {
    this.setState(this.getState(nextProps));
  }

  // credit to Stian Håklev
  shouldComponentUpdate(nextProps: PropT) {
    return this.props.operator._id !== nextProps.operator._id;
  }

  render() {
    const opConfig = this.props.operatorType.config;
    return opConfig && ![{}, undefined].includes(opConfig.properties)
      ? <EnhancedForm {...this.state}>
          <div />
        </EnhancedForm>
      : null;
  }
}
