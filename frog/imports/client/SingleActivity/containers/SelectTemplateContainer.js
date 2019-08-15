// @flow

import * as React from 'react';

import { store, type TemplateListingT, getTemplates } from '../store';
import { SelectTemplate } from '../components/steps/SelectTemplate';
import { observer } from 'mobx-react';

export const SelectTemplateContainer = observer(() => {
  const availableTemplates = React.useMemo(getTemplates, [getTemplates]);

  const onSelect = (item: TemplateListingT) => {
    store.setSelectedTemplateId(item.id);
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
