// @flow

import { Meteor } from 'meteor/meteor';
import { InjectData } from 'meteor/staringatlights:inject-data';
import { observable, action } from 'mobx';

import {
  type TemplateListingT,
  getTemplates,
  getTemplateById
} from './templates';

export { getTemplates };
export type { TemplateListingT };

const BASE_URL = window.location.origin;

export const STEP_SELECT_TEMPLATE = 'SELECT_TEMPLATE';
export const STEP_CONFIGURE_TEMPLATE = 'CONFIGURE_TEMPLATE';

class Store {
  @observable currentStep = STEP_SELECT_TEMPLATE;

  @observable templateListing: ?TemplateListingT = undefined;

  @observable templateConfig: ?Object = undefined;

  @observable loading: boolean = false;

  constructor() {
    // if user wants to clone an existing activity/graph, they use a /duplicate/ call, which
    // gets intercepted at the server level, and the appropriate data is fetched from the
    // database and passed along. We access this data with InjectData.getData. If there
    // is such data, we directly jump to the second screen and load it with the cloned data
    InjectData.getData('duplicate', data => {
      if (data) {
        this.setTemplateConfig(getTemplateById(data.activityType));
        this.setTemplateConfig(data.config);
        this.setCurrentStep(STEP_CONFIGURE_TEMPLATE);
      }
    });
  }

  @action
  setCurrentStep = (step: string) => {
    this.currentStep = step;
  };

  @action
  setTemplateListing = (listing: TemplateListingT) => {
    this.templateListing = listing;
  };

  @action
  setTemplateConfig = (config: Object) => {
    this.templateConfig = config;
  };

  @action
  setLoading = (loading: boolean) => {
    this.loading = loading;
  };

  createSession = () => {
    this.setLoading(true);
    if (this.templateListing && this.templateConfig) {
      if (!this.templateConfig.invalid) {
        Meteor.call(
          'create.graph.from.activity',
          this.templateListing.id,
          this.templateConfig,
          3,
          (err, result) => {
            if (err) {
              this.setLoading(false);
              window.alert(
                'Could not create your activity, please try again later.'
              );
            } else {
              const slug = result.slug;
              window.location.replace(
                `${BASE_URL}/t/${slug}?u=${Meteor.userId()}`
              );
            }
          }
        );
      } else {
        this.setLoading(false);
        window.alert('Could not create session, the configuration has errors');
      }
    } else {
      throw new Error('Config is undefined');
    }
  };
}

export const store = new Store();
