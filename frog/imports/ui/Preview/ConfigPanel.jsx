// @flow

import * as React from 'react';
import { uuid } from 'frog-utils';

import ApiForm from '../GraphEditor/SidePanel/ApiForm';
import { initActivityDocuments } from './Content';
import { activityTypesObj } from '../../activityTypes';
import { initDashboardDocuments } from './dashboardInPreviewAPI';
import { addDefaultExample } from './index';

import ExportButton from '../GraphEditor/SidePanel/ActivityPanel/ExportButton';

const style = {
  side: {
    flex: '0 1 500px',
    position: 'relative',
    overflow: 'auto',
    height: '100%',
    rightMargin: '20px'
  },
  preview: { width: '100%', height: 'calc(100% - 50px)', overflow: 'visible' }
};

// type StateT = {
//   lastRefreshAct: Date,
//   exportOpen: Boolean,
//   deleteOpen: Boolean,
//   importActivityList: Array<any>,
//   locallyChanged: Boolean,
//   idRemove: string
// };
//
// class PreviewContainer extends React.Component<Object, StateT> {
//   constructor(props){
//     super(props);
//     this.state = {
//       lastRefreshAct: new Date().getTime(),
//       exportOpen: false,
//       deleteOpen: false,
//       importActivityList: [],
//       locallyChanged: false,
//       idRemove: ''
//     }
//     collectActivities().then(e => {
//       this.state.importActivityList = e;
//       this.state.lastRefreshAct = new Date().getTime();
//     });
//   }

// const setDelete = val => this.setState({ deleteOpen: val });
// const setIdRemove = val => this.setState({ idRemove: val });
// const setImportActivityList = (val, fun?) =>
//   this.setState({ importActivityList: val }, fun);
// const refreshActDate = () =>
//   this.setState({ lastRefreshAct: new Date().getTime() });

{
  /* <Modal
  exportType="activity"
  modalOpen={this.state.exportOpen}
  setModal={x => this.setState({exportOpen: x})}
  madeChanges={() => this.setState({ locallyChanged: true})}
  // {...{ activity }}
/>
<ModalDelete
  modalOpen={this.state.deleteOpen}
  setModal={setDelete}
  remove={() =>
    removeActivity(this.state.idRemove).then(() =>
      setImportActivityList(
            this.state.importActivityList.filter(
              x => x.uuid !== this.state.idRemove
            )
          )
    )
  }
/> */
}

export default ({
  config,
  reloadAPIform,
  setConfig,
  setExample,
  setShowDashExample,
  activityTypeId,
  setReloadAPIform,
  setActivityTypeId,
  showDash,
  setShowDash,
  instances
}: Object) => (
  <div style={style.side} className="bootstrap">
    {activityTypeId && (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignContent: 'center'
        }}
      >
        <button
          onClick={() => {
            setActivityTypeId(null);
            setExample(0);
            setConfig({});
            setReloadAPIform(uuid());
          }}
          className="glyphicon glyphicon-arrow-left"
          style={{
            fontSize: '2em',
            color: 'blue',
            border: 0,
            background: 'none',
            cursor: 'pointer'
          }}
        />
        <h3>{activityTypesObj[activityTypeId].meta.name}</h3>
        <ExportButton
          activity={{ title: activityTypesObj[activityTypeId].meta.name }}
          madeChanges={() => console.log('changes')}
        />
      </div>
    )}
    <ApiForm
      hidePreview
      config={config}
      activityType={activityTypeId}
      onConfigChange={e => {
        if (e.errors.length === 0) {
          const aT = activityTypesObj[e.activityType];
          const _c = e.config;
          setConfig(_c);
          initActivityDocuments(instances, aT, -1, _c, true);
          initDashboardDocuments(aT, true);
        } else {
          setConfig({ invalid: true });
        }
        setActivityTypeId(e.activityType);
      }}
      onSelect={activityType => {
        const exConf = addDefaultExample(activityTypesObj[activityType])[0]
          .config;
        setConfig(exConf);
        if (showDash && !activityTypesObj[activityType].dashboard) {
          setShowDash(false);
        }
        setReloadAPIform(uuid());
        initActivityDocuments(instances, activityType, 0, exConf, true);
        initDashboardDocuments(activityType, true);
        setExample(0);
        setShowDashExample(false);
        setActivityTypeId(activityType);
      }}
      reload={reloadAPIform}
    />
  </div>
);
