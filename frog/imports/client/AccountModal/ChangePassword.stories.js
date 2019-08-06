import * as React from 'react';
import { storiesOf } from '@storybook/react';
import ChangePasswordForm from './ChangePassword'; 


storiesOf('ChangePassword', module).add('simple', () => <ChangePasswordForm/>)