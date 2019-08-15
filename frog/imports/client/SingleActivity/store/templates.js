// @flow
import { activityTypes } from '/imports/activityTypes';
import { templateTypes } from '/imports/internalTemplates';

// You can add the permitted activities for the single activity here
const availableSingleActivities = [
  'ac-quiz',
  'ac-ck-board',
  'ac-chat',
  'ac-brainstorm',
  'ac-ranking',
  'ac-video',
  'ac-select',
  'ac-prez'
];

export type TemplateListingT = {
  id: string,
  name: string,
  description?: string,
  imageSrc?: string
};

export const getTemplates = (): [TemplateListingT[], TemplateListingT[]] => {
  const singleActivityListings = activityTypes
    .filter(x => availableSingleActivities.includes(x.id))
    .map(singleActivity => ({
      id: singleActivity.id,
      name: singleActivity.meta.name,
      description: singleActivity.meta.shortDesc,
      imageSrc: '/' + singleActivity.id + '.png'
    }));

  const templateListings = templateTypes.map(template => ({
    id: template.id,
    name: template.meta.name,
    description: template.meta.shortDesc
  }));

  return [singleActivityListings, templateListings];
};
