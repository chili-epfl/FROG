import React, { Component } from 'react';
import '../../highlight';
import QuillCursors from '@minervaproject/quill-cursors';
import ReactQuill, { Quill } from 'react-quill';
import { get, last, forEach, debounce } from 'lodash';
import 'react-quill/dist/quill.snow.css';

import '../../css/quill.css';
import { getColor } from '../../color';

console.log(Quill);
Quill.register('modules/cursor', QuillCursors);

class RichEditorField extends Component {
  _storeRef = (ref) => (this._editor = ref);

  update = () => this._editor.getEditor().setContents(this.props.data);

  updateCursor = (range) =>
    this.props.doc.submitPresence({
      p: [this.props.uuid],
      t: 'rich-text',
      s: {
        u: this.props.currentUser.userId,
        c: 0,
        s: [[range.index, range.index + range.length]],
      },
    });

  setUpCursors = () => {
    const editor = this._editor.getEditor();
    console.log(editor);
    const cursors = editor.getModule('cursors');
    console.log(cursors);

    const debouncedUpdate = debounce(this.updateCursor, 500);

    editor.on('selection-change', (range, oldRange, source) => {
      if (range) {
        if (source === 'user') {
          this.updateCursor(range);
        } else {
          debouncedUpdate(range);
        }
      }
    });

    this.props.doc.on('presence', (srcList, submitted) => {
      srcList.forEach((src) => {
        const presence = this.props.doc.presence[src];
        if (!presence || !presence.p) {
          return;
        }

        if (presence.p[0] !== this.uuid) {
          cursors.removeCursor(presence.s.u);
          return;
        }

        if (presence.s.u) {
          const userId = presence.s.u;
          if (
            userId !== this.props.currentUser.userId &&
            presence.s.s &&
            presence.s.s.length > 0
          ) {
            // TODO: Can QuillCursors support multiple selections?
            const sel = presence.s.s[0];

            // Use Math.abs because the sharedb presence type
            // supports reverse selections, but I don't think
            // Quill Cursors does.
            var len = Math.abs(sel[1] - sel[0]);
            var min = Math.min(sel[0], sel[1]);

            cursors.createCursor(userId, userId, getColor(userId));
            cursors.moveCursor(userId, { index: min, length: len });
            if (submitted) {
              cursors.flashCursor(userId);
            }
          }
        }
      });
    });
  };

  componentDidMount() {
    this.update();
    const { doc } = this.props;
    doc.on('op', this.onOp);
    this.setUpCursors();
  }

  onOp = (op, source) => {
    if (source === this._editor) {
      return;
    }

    if (this._editor) {
      const editor = this._editor.getEditor();
      if (!editor) {
        return;
      }

      forEach(op, (operation) => {
        const operations = get(operation, 'o.ops') || get(operation, 'o');
        const opPath = last(operation.p);
        // Ensures the ops are for exactly this editor in situations where there
        // are multiple active editors in the page
        if (opPath === this.props.uuid) {
          editor.updateContents(operation.o);
        }
      });
    }
  };

  handleOnChange = (content, delta, source, editor) => {
    if (source === 'user') {
      const op = [
        {
          p: [this.props.uuid],
          t: 'rich-text',
          o: delta.ops,
        },
      ];
      this.props.doc.submitOp(op, { source: this._editor });
    }
  };

  render() {
    const { height } = this.props;

    const toolbarOptions = [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'link', 'blockquote', 'code-block'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
        { color: [] },
      ],
    ];

    const modules = {
      cursors: true,
      syntax: true,
      toolbar: toolbarOptions,
    };

    const className = `rich-text secondary-font font-size-inherit background-light-blue rounded line-height-3 ${height}`;

    return (
      <ReactQuill
        className={className}
        ref={this._storeRef}
        onChange={this.handleOnChange}
        modules={modules}
      />
    );
  }
}

RichEditorField.defaultProps = {
  modules: {},
  height: 'medium',
};

export default RichEditorField;

