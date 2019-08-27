// @flow

import * as React from 'react';

import { Typography, makeStyles } from '@material-ui/core';

import { ItemGrid } from '/imports/ui/ItemGrid';
import { PictureButton } from '/imports/ui/Button/PictureButton';
import { RowButton, RowDivider } from '/imports/ui/RowItems';

import { type TemplateListingT } from '../../store/templates';
import { SplitLayout } from '../ui/SplitLayout';

const useStyle = makeStyles(() => ({
  title: {
    marginBottom: '16px',
    fontSize: '1.5em'
  }
}));

type SelectTemplatePropsT = {
  availableSingleActivityTemplates: TemplateListingT[],
  availableGraphTemplates: TemplateListingT[],
  onSelect: (listing: TemplateListingT) => void
};

export const SelectTemplate = (props: SelectTemplatePropsT) => {
  const classes = useStyle();
  return (
    <SplitLayout
      left={
        <>
          <Typography className={classes.title} variant="h2">
            Select a single activity
          </Typography>
          <ItemGrid
            items={props.availableSingleActivityTemplates}
            mapItem={item => (
              <PictureButton
                key={item.id}
                text={item.name}
                onClick={() => {
                  props.onSelect(item);
                }}
              >
                <img src={item.imageSrc} alt="" />
              </PictureButton>
            )}
          />
        </>
      }
      right={
        <>
          <Typography className={classes.title} variant="h2">
            or select a template
          </Typography>
          <RowDivider />
          {props.availableGraphTemplates.map(item => (
            <React.Fragment key={item.id}>
              <RowButton
                size="auto"
                onClick={() => {
                  props.onSelect(item);
                }}
              >
                <span style={{ fontWeight: 600 }}>{item.name}</span>
                {item.shortDesc && (
                  <p
                    style={{
                      fontWeight: 'normal',
                      margin: '4px 0px 0px 0px',
                      color: '#777'
                    }}
                  >
                    {item.shortDesc}
                  </p>
                )}
              </RowButton>
              <RowDivider />
            </React.Fragment>
          ))}
        </>
      }
      rightPanelSize="1fr"
    />
  );
};
