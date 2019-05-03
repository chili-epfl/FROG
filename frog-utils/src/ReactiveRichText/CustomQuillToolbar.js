// @flow

import React, { Component } from 'react';

// Add styles for LI+ button in toolbar
const menuItemStyle = document.createElement('style');
menuItemStyle.type = 'text/css';
menuItemStyle.innerHTML = `.ql-insertLi .ql-picker-item:before { content: attr(data-label); }
      .ql-insertLi .ql-picker-label:before { content: 'LI+'; padding-right: 12px; }`;
document.documentElement // $FlowFixMe
  .getElementsByTagName('head')[0]
  .appendChild(menuItemStyle);

type CustomQuillToolbarPropsT = {
  id: string,
  readOnly: Object,
  liTypes: Object
};

class CustomQuillToolbar extends Component<CustomQuillToolbarPropsT> {
  render() {
    const { id, readOnly, liTypes } = this.props;
    const AuthorshipToggleBtn = () => <span>AU</span>;

    return (
      <div
        id={`toolbar-${id}`}
        style={{ display: readOnly ? 'none' : 'block' }}
      >
        <button className="ql-bold" />
        <button className="ql-italic" />
        <button className="ql-underline" />
        <button className="ql-strike" />

        <button className="ql-blockquote" />
        <button className="ql-code-block" />

        <select
          className="ql-header"
          defaultValue=""
          onChange={e => e.persist()}
        >
          <option value="1" />
          <option value="2" />
          <option defaultValue />
        </select>

        <button className="ql-list" value="ordered" />
        <button className="ql-list" value="bullet" />
        <button className="ql-indent" value="-1" />
        <button className="ql-indent" value="+1" />

        <button className="ql-link" />
        <button className="ql-image" />
        <button className="ql-video" />
        <button className="ql-table">
          <svg viewBox="0 0 18 18">
            <rect className="ql-stroke" height="12" width="12" x="3" y="3" />
            <rect className="ql-fill" height="2" width="3" x="5" y="5" />
            <rect className="ql-fill" height="2" width="4" x="9" y="5" />
            <g className="ql-fill ql-transparent">
              <rect height="2" width="3" x="5" y="8" />
              <rect height="2" width="4" x="9" y="8" />
              <rect height="2" width="3" x="5" y="11" />
              <rect height="2" width="4" x="9" y="11" />
            </g>
          </svg>
        </button>

        <button className="ql-toggleAuthorship">
          <AuthorshipToggleBtn />
        </button>
        <select className="ql-insertLi" onChange={e => e.persist()}>
          <option value="">Select type...</option>
          {liTypes.map(type => (
            <option key={`${type.id}-${id}`} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>
    );
  }
}

export default CustomQuillToolbar;
