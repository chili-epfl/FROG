// @flow

import * as React from 'react';
import { storiesOf } from '@storybook/react';

import { PictureButton } from '.';
import { StorybookContainer } from '/imports/ui/StorybookContainer';

import img from './demo.jpg';

storiesOf('UI/PictureButton', module).add('default', () => (
  <StorybookContainer width={185} padding={10}>
    <PictureButton text="Hello World!">
      <img width="160" src={img} alt="" />
    </PictureButton>
    <PictureButton text="With very very very very very long text">
      <img width="160" src={img} alt="" />
    </PictureButton>
    <PictureButton text="With very very very very very long text">
      <img width="100" src={img} alt="" />
    </PictureButton>
  </StorybookContainer>
));
