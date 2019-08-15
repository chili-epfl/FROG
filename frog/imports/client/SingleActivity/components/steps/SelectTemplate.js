// @flow

import * as React from 'react';

import { Clear } from '@material-ui/icons';
import { Typography } from '@material-ui/core';

import { ItemGrid } from '/imports/ui/ItemGrid';
import { PictureButton } from '/imports/ui/Button/PictureButton';
import { RowButton, RowDivider } from '/imports/ui/RowItems';

import { type TemplateListingT } from '../../store';
import { SplitLayout } from '../ui/SplitLayout';

type SelectTemplatePropsT = {
  availableSingleActivityTemplates: TemplateListingT[],
  availableGraphTemplates: TemplateListingT[],
  onSelect: (listing: TemplateListingT) => void
};

export const SelectTemplate = (props: SelectTemplatePropsT) => {
  return (
    <SplitLayout
      left={
        <>
          <Typography
            variant="h2"
            style={{ marginBottom: '32px', fontSize: '1.5em' }}
          >
            Select a single activity
          </Typography>
          <ItemGrid
            items={props.availableSingleActivityTemplates}
            mapItem={item => (
              <PictureButton
                key={item.id}
                height="150px"
                src={item.imageSrc}
                onClick={() => {
                  props.onSelect(item);
                }}
              >
                {item.name}
              </PictureButton>
            )}
          />
        </>
      }
      right={
        <>
          <Typography
            variant="h2"
            style={{ marginBottom: '32px', fontSize: '1.5em' }}
          >
            or select a template
          </Typography>
          {props.availableGraphTemplates.map(item => (
            <>
              <RowButton
                key={item.id}
                size="large"
                onClick={() => {
                  props.onSelect(item);
                }}
              >
                {item.name}
              </RowButton>
              <RowDivider />
            </>
          ))}
        </>
      }
    />
  );
};
