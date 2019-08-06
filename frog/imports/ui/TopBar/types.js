// @flow
import * as React from 'react';

export type TopBarViewT = {
  /**
   * Required for React and for E2E testing
   */
  id: string,
  /**
   * If specified, the title will be displayed as a tooltip
   */
  icon: React.Node,
  /**
   * Shown inside the button if no icon is specified, or as a tooltip
   */
  title: string
};

export type TopBarActionT = {
  /**
   * Required for React and for E2E testing
   */
  id: string,
  /**
   * If specified, the title will be displayed as a tooltip
   */
  icon?: React.Node,
  /**
   * Shown inside the button if no icon is specified, or as a tooltip
   */
  title?: string,
  callback?: () => void
};
