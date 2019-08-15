// @flow

import { observable, computed, action, reaction } from 'mobx';

import { type TemplateListingT, getTemplates } from './templates';
export { getTemplates };
export type { TemplateListingT };

class Store {
  @observable currentStep = 0;
  @observable selectedTemplateListing: ?TemplateListingT = undefined;
  @observable templateConfig: ?Object = undefined;

  @action
  nextStep = () => this.currentStep++;

  @action
  prevStep = () => this.currentStep--;

  @action
  setSelectedTemplateId = (listing: TemplateListingT) => {
    this.selectedTemplateListing = listing;
  };

  @action
  setTemplateConfig = (config: Object) => {
    this.templateConfig = config;
  };
}

export const store = new Store();
