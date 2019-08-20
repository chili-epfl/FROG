// @flow

import * as _ from 'lodash';
import * as React from 'react';
import { withRouter } from 'react-router';
import { observer } from 'mobx-react';

import { goToTemplateConfig } from '../store/navigation';
import { getTemplates, type TemplateListingT } from '../store/templates';

import { SelectTemplate } from '../components/steps/SelectTemplate';

export const SelectTemplateContainer = _.flow(withRouter)(({ history }) => {
  const availableTemplates = React.useMemo(getTemplates, [getTemplates]);

  const onSelect = (item: TemplateListingT) => {
    goToTemplateConfig(history, item.id);
  };

  return (
    <SelectTemplate
      availableSingleActivityTemplates={availableTemplates[0]}
      availableGraphTemplates={availableTemplates[1]}
      onSelect={onSelect}
    />
  );
});
