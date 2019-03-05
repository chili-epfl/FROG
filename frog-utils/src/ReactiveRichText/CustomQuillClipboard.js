// @flow

import { Quill } from '@houshuang/react-quill';
import { get, find } from 'lodash';

const Clipboard = Quill.import('modules/clipboard');

class CustomQuillClipboard extends Clipboard {
  // There is a bug in Quill that causes the container scroll to jump on
  // content paste. (Refer https://github.com/quilljs/quill/issues/1082)
  // Following implements a modified version of the workaround suggested by the
  // original author of Quill.
  onPaste(e: any) {
    const found = find(
      e.path,
      element => element.className === 'ql-learning-item'
    );
    // if found, that means the paste is done inside a LI. So bypass quill processing.
    if (!found) {
      const quill = this.quill;
      const [range] = quill.selection.getRange();
      const cursorIndex = get(range, 'index');
      const editorLength = quill.getLength();

      // Save existing scroll positions
      const scrollTops = e.path.map(element => get(element, 'scrollTop'));
      super.onPaste(e);
      setTimeout(() => {
        // Restore scroll positions
        e.path.forEach((element, index) => {
          element.scrollTop = scrollTops[index];
        });
        // If pasted at end of editor, scroll to bottom
        if (cursorIndex && cursorIndex + 1 === editorLength) {
          const scrollContainer = find(e.path, element =>
            element.className.includes('ql-editor')
          );
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
      }, 1);
    }
  }
}

export default CustomQuillClipboard;
