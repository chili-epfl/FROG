// @flow

import { Meteor } from 'meteor/meteor';
import { observable, action } from 'mobx';

import { type TemplateListingT, getTemplates } from './templates';

export { getTemplates };
export type { TemplateListingT };

const BASE_URL = window.location.origin;

class Store {
  @observable currentStep = 0;

  @observable selectedTemplateListing: ?TemplateListingT = undefined;

  @observable templateConfig: ?Object = undefined;

  @observable loading: boolean = false;

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

  @action
  createSession = () => {
    if (this.templateConfig) {
      this.loading = true;
      Meteor.call(
        'create.graph.from.activity',
        this.templateConfig.activityType,
        this.templateConfig.config,
        3,
        (err, result) => {
          if (err) {
            this.loading = false;
            window.alert('Could not create your activity, please try later.');
          } else {
            const slug = result.slug;
            window.location.replace(
              `${BASE_URL}/t/${slug}?u=${Meteor.userId()}`
            );
          }
        }
      );
    } else {
      throw new Error('Config is undefined');
    }
  };
}

export const store = new Store();
