// @flow
import { activityTypes, activityTypesObj } from '/imports/activityTypes';
import { templateTypes, templatesObj } from '/imports/internalTemplates';

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
  type: 'singleActivity' | 'template',
  id: string,
  name: string,
  shortDesc: string,
  description: string,
  imageSrc?: string
};

export const getTemplates = (): [TemplateListingT[], TemplateListingT[]] => {
  const singleActivityListings = activityTypes
    .filter(x => availableSingleActivities.includes(x.id))
    .map(singleActivity => ({
      type: 'singleActivity',
      id: singleActivity.id,
      name: singleActivity.meta.name,
      shortDesc: singleActivity.meta.shortDesc,
      description: singleActivity.meta.description,
      imageSrc: '/' + singleActivity.id + '.png'
    }));

  const templateListings = templateTypes.map(template => ({
    type: 'template',
    id: template.id,
    name: template.meta.name,
    shortDesc: template.meta.shortDesc,
    description: template.meta.description
  }));

  return [singleActivityListings, templateListings];
};
