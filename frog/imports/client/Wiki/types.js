// @flow
export type WikiSettingsT = {
  readOnly: boolean,
  allowPageCreation: boolean,
  password: string,
  locked: boolean,
  restrict: string
};

export type PageObjT = {
  wikiId: string,
  pageTitle?: string,
  instance?: string
};

export const KEY_ENTER = 13;
export const PERM_ALLOW_EVERYTHING = 'none';
export const PERM_PASSWORD_TO_EDIT = 'edit';
export const PERM_PASSWORD_TO_VIEW = 'view';
export const PRIVILEGE_OWNER = 'owner';
export const PRIVILEGE_EDIT = 'editor';
export const PRIVILEGE_VIEW = 'user';
export const PRIVILEGE_NONE = 'none';
