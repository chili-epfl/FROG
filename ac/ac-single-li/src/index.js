// @flow

import * as React from 'react';
import { type ActivityPackageT, withVisibility } from 'frog-utils';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';

const meta = {
  name: 'Add/edit single LI',
  shortDesc: 'New activity, no description available',
  description: 'New activity, no description available',
  exampleData: [
    { title: 'Case with no data', config: { title: 'No data' }, data: {} }
  ]
};

const config = {
  type: 'object',
  properties: {
    title: { type: 'string', title: 'Title' },
    instructions: { type: 'string', title: 'Instructions' },
    liType: {
      title: 'Learning Item Type',
      type: 'learningItemType'
    },
    allowEditing: {
      title: 'Allow editing after submission',
      default: true,
      type: 'boolean'
    }
  }
};

const configUI = { instructions: { 'ui:widget': 'textarea' } };

const dataStructure = {};

// the actual component that the student sees
const ActivityRunner = withVisibility(
  ({
    activityData: { config: conf },
    data,
    dataFn,
    visible,
    setVisibility
  }) => {
    const header = (
      <>
        {conf.title && <h1>{conf.title}</h1>}
        {conf.instructions && (
          <p>
            <b>{conf.instructions}</b>
          </p>
        )}
      </>
    );
    if (data.li) {
      return (
        <>
          {header}
          <dataFn.LearningItem
            type={visible ? 'edit' : 'view'}
            id={data.li}
            render={({ editable, children }) => (
              <div>
                {children}
                {!visible &&
                  conf.allowEditing && (
                    <Button
                      onClick={() =>
                        editable
                          ? setVisibility(true)
                          : dataFn.objDel(null, 'li')
                      }
                      variant="fab"
                      color="secondary"
                      aria-label={editable ? 'edit' : 'delete'}
                    >
                      {editable ? <EditIcon /> : <CloseIcon />}
                    </Button>
                  )}
                {visible && (
                  <Button
                    onClick={() => setVisibility(false)}
                    color="primary"
                    variant="raised"
                    aria-label="save"
                  >
                    Save
                  </Button>
                )}
              </div>
            )}
          />
        </>
      );
    } else {
      return (
        <>
          {header}
          <dataFn.LearningItem
            type="create"
            liType={conf.liType}
            onCreate={li => dataFn.objInsert(li, 'li')}
          />
        </>
      );
    }
  }
);

export default ({
  id: 'ac-single-li',
  type: 'react-component',
  meta,
  config,
  configUI,
  ActivityRunner,
  dashboard: null,
  dataStructure
}: ActivityPackageT);
