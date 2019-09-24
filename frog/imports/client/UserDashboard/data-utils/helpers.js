/* eslint-disable array-callback-return */
import { Bookmark, Bookmarks, ShowChart } from '@material-ui/icons';
import DescriptionIcon from '@material-ui/icons/Description';
import ArchiveIcon from '@material-ui/icons/Archive';
import { activityTypesObj } from '/imports/activityTypes';
import { templatesObj } from '/imports/internalTemplates';
import { store } from '../../GraphEditor/store';
import { addGraph, setArchiveStatus } from '/imports/api/graphs';
import { setSessionArchive } from '/imports/api/sessions';

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

type meteorTemplateObjectT = {
  name: string,
  graph: object,
  createdAt: Date,
  _id: string
};

type meteorDraftsList = Array<meteorDraftObjectT>;

type meteorSessionsListT = Array<meteorSessionObjectT>;

type meteorTemplatesList = Array<meteorTemplateObjectT>;

export const parseDate = (date): Date => {
  return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ${date.getDate()}/${date.getMonth() +
    1}/${date.getFullYear()}`;
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
  if (session.singleActivity)
    return activityTypesObj[(session.simpleConfig?.activityType)]?.meta?.name;
  else if (session.template)
    return templatesObj[(session.simpleConfig?.activityType)]?.meta?.name;
  else return session.name;
};

const getSessionTypeInfo = (session): meteorSessionObjectT => {
  if (session.singleActivity) return `Single Activity | Slug: ${session.slug}`;
  else if (session.template) return `Template | Slug: ${session.slug}`;
  else return `Graph | Slug: ${session.slug}`;
};

export const parseDraftData = (draftsList: meteorDraftsList, history: Object) =>
  draftsList
    .filter(x => !x.published && !x.sessionGraph && !x.templateGraph)
    .map(item => ({
      itemIcon: ShowChart,
      itemTitle: item.name,
      dateCreated: parseDate(item.createdAt),
      dateObj: item.createdAt,
      callback: () => history.push(`/teacher/graph/${item._id}`),
      secondaryActions: [
        {
          icon: ArchiveIcon,
          title: item.archived ? 'Unarchive' : 'Archive',
          action: () =>
            item.archived
              ? setArchiveStatus(item._id, null)
              : setArchiveStatus(item._id, true)
        }
      ]
    }));

export const parseSessionData = (
  sessionsList: meteorSessionsListT,
  history: Object
) =>
  sessionsList.map(item => ({
    itemIcon: getSessionIcon(item),
    itemTitle: getSessionTitle(item),
    status: getSessionStatus(item),
    itemType: getSessionTypeInfo(item),
    dateCreated: parseEpocDate(item.startedAt),
    dateObj: new Date(item.startedAt),
    callback: () => history.push(`t/${item.slug}`),
    secondaryActions: [
      {
        icon: ArchiveIcon,
        title: item.archived ? 'Unarchive' : 'Archive',
        action: () =>
          item.archived
            ? setSessionArchive(item._id, null)
            : setSessionArchive(item._id, true)
      }
    ]
  }));

export const parseTemplateData = (
  templateList: meteorTemplatesList,
  history: Object
) =>
  templateList.map(item => ({
    itemIcon: DescriptionIcon,
    itemTitle: item.name,
    dateCreated: parseDate(item.createdAt),
    dateObj: item.createdAt,
    callback: () => {
      history.push(`/teacher/graph/`);
      const newGraphId = addGraph({ ...item.graph, templateSource: item._id });
      store.setId(newGraphId);
      store.setTemplateOpenFlag(true);
    }
  }));
