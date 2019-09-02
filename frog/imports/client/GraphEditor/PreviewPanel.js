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
  const activityToPreview = selected && Activities.findOne(selected.id);
  return activityToPreview &&
    selected.activityType &&
    activityTypesObj[selected.activityType]?.meta?.preview !== false ? (
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
