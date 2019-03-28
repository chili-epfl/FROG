// @flow

const LiViewTypes = {
  VIEW: 'view',
  THUMB: 'thumbView',
  EDIT: 'edit'
};

const formats = [
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'code-block',
  'header',
  'list',
  'link',
  'image',
  'video',
  'learning-item',
  'author',
  'li-view',
  'background',
  'wiki-link'
];

const Keys = {
  TAB: 9,
  ENTER: 13,
  ESCAPE: 27,
  UP: 38,
  DOWN: 40,
};

export { LiViewTypes, formats, Keys };
