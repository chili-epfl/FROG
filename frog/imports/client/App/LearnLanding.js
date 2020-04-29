// @flow
import * as React from 'react';
import { withRouter } from 'react-router';

import LearnLandingPage from '/imports/ui/LearnLandingPage';
import { LocalSettings } from '/imports/api/settings';

const LearnLanding = ({
  errorMessage,
  history
}: {
  errorMessage?: string,
  history: any
}) => {
  const onSlugEnter = (slug: string) => {
    window.notReady();
    history.push('/' + slug + LocalSettings.UrlCoda);
  };

  return (
    <LearnLandingPage errorMessage={errorMessage} onSlugEnter={onSlugEnter} />
  );
};

export default withRouter(LearnLanding);
