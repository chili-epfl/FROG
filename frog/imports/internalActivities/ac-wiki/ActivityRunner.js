// @flow

import * as React from 'react';
import type { ActivityRunnerPropsT } from 'frog-utils';

import Wiki from '/imports/client/Wiki';

const ActivityRunner = (props: ActivityRunnerPropsT) => {
  const {
    activityData: { config }
  } = props;

  const pageObj = {
    wikiId: config.component.wiki,
    pageTitle: config.component.page
  };

  return <Wiki pageObj={pageObj} setPage={() => {}} embed />;
};

export default ActivityRunner;
