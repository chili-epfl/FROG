// @flow

import * as React from 'react';
import { observer } from 'mobx-react';

import { store, type TemplateListingT, getTemplates } from '../store';
import { SelectTemplate } from '../components/steps/SelectTemplate';

export const SelectTemplateContainer = observer(() => {
  const availableTemplates = React.useMemo(getTemplates, [getTemplates]);

  const onSelect = (item: TemplateListingT) => {
    store.setSelectedTemplateId(item);
    store.nextStep();
  };

  return (
    <SelectTemplate
      availableSingleActivityTemplates={availableTemplates[0]}
      availableGraphTemplates={availableTemplates[1]}
      onSelect={onSelect}
    />
  );
});
