import * as React from 'react';
import { DashboardSideBar } from '/imports/ui/DashboardSideBar';
import { store } from '../store/store';

export const DashboardContentContainer = props => {
  const [selectedPage, setSelectedPage] = React.useState({
    sessionsView: false,
    draftsView: false,
    recentsView: false
  });
  const onSelectRecentsView = () => {
    props.history.push('/recents');
    store.setActive('Recents');
    setSelectedPage(...selectedPage, { recentsView: true });
  };
  const onSelectSessionsView = () => {
    props.history.push('/sessions');
    store.setActive('Sessions');
    setSelectedPage(...selectedPage, { sessionsView: true });
  };
  const onSelectDraftsView = () => {
    props.history.push('/drafts');
    store.setActive('Drafts');
    setSelectedPage(...selectedPage, { draftsView: true });
  };

  return (
    <DashboardSideBar
      callbackSessionsView={onSelectSessionsView}
      callbackRecentsView={onSelectRecentsView}
      callbackDraftsView={onSelectDraftsView}
      sessionsActive={selectedPage.sessionsView}
      draftsActive={selectedPage.draftsView}
      recentsActive={selectedPage.recentsView}
    >
      {props.content}
    </DashboardSideBar>
  );
};
