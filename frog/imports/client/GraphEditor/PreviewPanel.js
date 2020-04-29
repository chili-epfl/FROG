// @flow
import * as React from 'react';
import { connect } from './store';
import Preview from '../Preview';
import { Activities, storeTemplateData } from '/imports/api/activities';
import { activityTypesObj } from '/imports/activityTypes';

const PreviewPanel = ({
  store: {
    ui: { selected }
  }
}) => {
  if (!selected) return null;
  const activityToPreview = Activities.findOne(selected.id);
  if (!activityToPreview) return <p>Nothing to preview</p>;
  if (!selected.activityType) return null;
  const aTO = activityTypesObj[selected.activityType];
  if (
    aTO.validateConfig &&
    aTO.validateConfig.find(f => f(selected.dataDelayed))
  )
    return <p>The config is invalid</p>;

  return aTO && aTO?.meta?.preview !== false ? (
    <Preview
      activityTypeId={activityToPreview.activityType}
      graphEditor
      key={activityToPreview._id}
      config={selected.dataDelayed}
      template={activityToPreview.template}
      storeTemplateFn={data => {
        storeTemplateData(activityToPreview._id, data);
        window.alert('Template stored/updated');
      }}
    />
  ) : null;
};

export default connect(PreviewPanel);
