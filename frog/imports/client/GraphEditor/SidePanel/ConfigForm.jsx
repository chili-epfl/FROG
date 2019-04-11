// @flow

import React, { Component } from 'react';
import { EnhancedForm,A } from 'frog-utils';
import { isEqual, debounce } from 'lodash';

import { Activities, addActivity } from '/imports/api/activities';
import { Operators, addOperator } from '/imports/api/operators';

import {
  SelectFormWidget,
  SelectAnyActivityWidget,
  SelectSourceActivityWidget,
  SelectTargetActivityWidget,
  addSocialFormSchema,
  SelectLITypeWidget,
  SelectLITypeEditorWidget,
  QuillWidget
} from './FormUtils';

type ConfigFormPropsT = {
  node: Object,
  nodeType: any,
  connectedActivities?: any,
  connectedSourceActivities?: any,
  connectedTargetActivities?: any,
  valid: any,
  refreshValidate: Function,
  reload?: any,
  widgets?: any,
  data?: Object,
  onChange?: Function
};

export default class ConfigForm extends Component<
  ConfigFormPropsT,
  { formData: Object, id?: string, lastChange: Object }
> {
  unmounted: boolean;

  constructor(props: ConfigFormPropsT) {
    super(props);
    this.state = {
      formData: this.props.node.data,
      lastChange: this.props.node.data
    };
  }

  componentWillReceiveProps(nextProps: ConfigFormPropsT) {
    if (
      this.props.reload !== nextProps.reload &&
      this.props.data !== nextProps.data
    ) {
      this.setState({ formData: nextProps.data, id: nextProps.reload });
      return;
    }
    if (
      (this.props.node._id !== nextProps.node._id ||
        this.props.reload !== nextProps.reload) &&
      !nextProps.data
    ) {
      const coll = this.props.node.operatorType ? Operators : Activities;
      this.setState({ formData: coll.findOne(nextProps.node._id).data });
    }
  }

  shouldComponentUpdate(nextProps: ConfigFormPropsT): boolean {
    if (
      this.props.data !== nextProps.data &&
      this.props.reload !== nextProps.reload
    ) {
      return true;
    }
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

  componentWillUnmount() {
    this.unmounted = true;
    if (!isEqual(this.state.formData, this.state.lastChange)) {
      this.onChangeImmediately({ formData: this.state.formData });
    }
  }

  onChange = debounce(data => this.onChangeImmediately(data), 1000);

  onChangeImmediately = (data: *) => {
    if (this.props.onChange) {
      this.props.onChange(data);
    } else {
      if (this.props.node.operatorType) {
        addOperator(
          this.props.node.operatorType,
          {
            component: this.props.data && this.props.data.component,
            ...data.formData
          },
          this.props.node._id
        );
      } else {
        addActivity(
          this.props.node.activityType,
          {
            component: this.props.data && this.props.data.component,
            ...data.formData
          },
          this.props.node._id,
          null
        );
      }
      if (!this.unmounted) {
        this.setState({ lastChange: data.formData });
      }
      this.props.refreshValidate();
    }
  };

  render() {
    const {
      node,
      nodeType,
      valid,
      connectedActivities,
      connectedSourceActivities,
      connectedTargetActivities
    } = this.props;
    const props = {
      formData: this.state.formData,
      ...addSocialFormSchema(nodeType.config, nodeType.configUI),
      widgets: {
        ...this.props.widgets,
        socialAttributeWidget: SelectFormWidget,
        anyActivityWidget: SelectAnyActivityWidget,
        targetActivityWidget: SelectTargetActivityWidget,
        sourceActivityWidget: SelectSourceActivityWidget,
        learningItemTypeWidget: SelectLITypeWidget,
        learningItemTypeEditorWidget: SelectLITypeEditorWidget,
        quillWidget: QuillWidget
      },
      reload: this.props.reload,
      id: node._id,
      formContext: {
        options: valid.social[node._id] || [],
        connectedActivities,
        connectedSourceActivities,
        connectedTargetActivities,
        groupingKey: node.groupingKey
      },
      onChange: data => {
        this.setState({ formData: data.formData });
        this.onChange(data);
      }
    };

    const nodeConfig = this.props.nodeType.config;
    return nodeConfig && ![{}, undefined].includes(nodeConfig.properties) ? (
      <div className="bootstrap" style={{ padding: '0 10px' }}>
        {this.props.showSubmit && (
          <A onClick={() => this.props.onSubmit(this.props.node, this.state.formData)}>
            Add wiki page based on this activity type and config
          </A>
        )}
        <EnhancedForm
          showErrorList={false}
          noHtml5Validate
          {...props}
          id={this.state.id}
        >
          <div />
        </EnhancedForm>
      </div>
    ) : null;
  }
}
