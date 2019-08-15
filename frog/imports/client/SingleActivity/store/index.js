// @flow

import { observable, computed, action, autorun } from 'mobx';

export { TemplateListingT, getTemplates } from './templates';

export const store = observable({
  currentStep: 0,
  selectedTemplateId: undefined,
  reset: action(() => {
    store.currentStep = 0;
  }),
  nextStep: action(() => store.currentStep++),
  previousStep: action(() => store.currentStep--),
  setSelectedTemplateId: action((id: string) => {
    store.selectedTemplateId = id;
  })
});
