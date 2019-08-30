// @flow

import * as React from 'react';
import { makeStyles } from '@material-ui/core';
import { ArrowDownward, ArrowUpward, Clear, Add } from '@material-ui/icons';
import { type ArrayFieldTemplateProps } from 'react-jsonschema-form';

import { Button } from '/imports/ui/Button';
import { Label } from './components/Label';

const useStyle = makeStyles(theme => ({
  element: {
    display: 'flex',
    borderTop: '1px solid #EAEAEA',
    margingTop: theme.spacing(1),
    padding: theme.spacing(1, 0)
  },
  elementContent: {
    flexGrow: 1
  },
  knobContainer: {
    display: 'flex',
    flexFlow: 'column nowrap',
    marginLeft: theme.spacing(1)
  }
}));

export const ArrayFieldTemplate = (props: ArrayFieldTemplateProps) => {
  const classes = useStyle();

  return (
    <Label label={props.title}>
      {props.items &&
        props.items.map(element => (
          <div key={element.index} className={classes.element}>
            <div className={classes.elementContent}>{element.children}</div>
            <div className={classes.knobContainer}>
              {element.hasMoveUp && (
                <Button
                  variant="minimal"
                  icon={<ArrowUpward fontSize="small" />}
                  onClick={element.onReorderClick(
                    element.index,
                    element.index - 1
                  )}
                />
              )}
              {element.hasMoveDown && (
                <Button
                  variant="minimal"
                  icon={<ArrowDownward fontSize="small" />}
                  onClick={element.onReorderClick(
                    element.index,
                    element.index + 1
                  )}
                />
              )}
              <Button
                icon={<Clear fontSize="small" />}
                onClick={element.onDropIndexClick(element.index)}
              />
            </div>
          </div>
        ))}

      {props.canAdd && (
        <div className={classes.element}>
          <Button icon={<Add fontSize="small" />} onClick={props.onAddClick}>
            Add element
          </Button>
        </div>
      )}
    </Label>
  );
};
