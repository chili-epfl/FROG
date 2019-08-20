// @flow 
import * as React from 'react'; 
import {TopBarAccountsWrapper} from './TopBarAccountsWrapper'; 
import {type TopBarWrapperPropsT, type MenuItemT } from './types'; 

export const TopBarWrapper = ({title, menuItems}: TopBarWrapperPropsT) => {
  return  <TopBarAccountsWrapper title = {title} menuItems = {menuItems} />
}