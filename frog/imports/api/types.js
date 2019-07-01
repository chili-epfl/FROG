// @flow

export type ErrorT = {
  id: string,
  nodeType?: 'operator' | 'activity',
  err: string,
  type: string,
  severity: 'error' | 'warning'
};

export type ErrorListT = ErrorT[];

export type SocialT = { [activityId: string]: string[] };
