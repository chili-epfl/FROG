/* eslint-disable array-callback-return */
import { Bookmark, Bookmarks, ShowChart } from '@material-ui/icons';

type meteorSessionObjectT = {
  _id: string,
  name: string,
  startedAt: string,
  singleActivity: boolean,
  template: boolean,
  state: 'READY' | 'PAUSED' | 'STARTED' | 'FINISHED',
  slug: string,
  simpleConfig: { activityType: string }
};
type meteorDraftObjectT = {
  name: string,
  createdAt: Date,
  _id: string
};
type meteorDraftsList = Array<meteorDraftObjectT>;

type meteorSessionsListT = Array<meteorSessionObjectT>;

export const parseDate = (date): Date => {
  return `${date.getDate()} /${date.getMonth() + 1} / ${date.getFullYear()}`;
};

const parseEpocDate = (epoc): string => {
  const date = new Date(epoc);
  return parseDate(date);
};

const getSessionIcon = (session): meteorSessionObjectT => {
  if (session.singleActivity) return Bookmark;
  else if (session.template) return Bookmarks;
  else return ShowChart;
};

const getSessionStatus = (session): meteorSessionObjectT => {
  if (session.state === 'READY') return 'Ready';
  else if (session.state === 'PAUSED') return 'Paused';
  else if (session.state === 'STARTED') return 'Running';
  else if (session.state === 'FINISHED') return 'Complete';
};

const getSessionTitle = (session): meteorSessionObjectT => {
  if (session.singleActivity) return session.simpleConfig.activityType;
  else if (session.template) return session.simpleConfig.activityType;
  else return session.name;
};

const getSessionTypeInfo = (session): meteorSessionObjectT => {
  if (session.singleActivity) return `Single Activity | Slug: ${session.slug}`;
  else if (session.template) return `Template | Slug: ${session.slug}`;
  else return `Graph | Slug: ${session.slug}`;
};

export const parseDraftData = (
  draftsList: meteorDraftsList,
  history: Object
) => {
  const resArray = [];
  draftsList.map(item => {
    resArray.push({
      itemIcon: ShowChart,
      itemTitle: item.name,
      dateCreated: parseDate(item.createdAt),
      callback: () => history.push(`/teacher/graph/${item._id}`)
    });
  });
  return resArray;
};

export const parseSessionData = (
  sessionsList: meteorSessionsListT,
  history: Object
) => {
  const resArray = [];
  sessionsList.map(item => {
    resArray.push({
      itemIcon: getSessionIcon(item),
      itemTitle: getSessionTitle(item),
      status: getSessionStatus(item),
      itemType: getSessionTypeInfo(item),
      dateCreated: parseEpocDate(item.startedAt),
      callback: () => history.push(`t/${item.slug}`)
    });
  });
  return resArray;
};
