// based on https://github.com/nickasd/sharedb-codemirror/blob/master/sharedb-codemirror.js
import { get, isEqual } from 'lodash';
import { uuid } from 'frog-utils';

class ShareDBCodeMirror {
  /**
   * @constructor
   * @param {CodeMirror} codeMirror - a CodeMirror editor instance
   * @param {Object} options - configuration options:
   *    - key: string; required. The key in the ShareDB doc at which to store the
   *      CodeMirror value. Deeply nested paths are currently not supported.
   *    - errorHandler: optional. A handler to which a single error message is
   *      provided. The default behavior is to print error messages to the console.
   *    - verbose: optional. If true, log messages will be printed to the console.
   * @return {ShareDBCodeMirror} the created ShareDBCodeMirror object
   */
  constructor(codeMirror, doc, path, options = {}) {
    this.codeMirror = codeMirror;
    this.doc = doc;
    this.key = Array.isArray(path) ? path : [path];
    this.source = uuid();
    this.errorHandler =
      options.errorHandler ||
      function(error) {
        console.error(error);
      };
    var verbose = true||Boolean(options.verbose);
    this.log = (...args) => {
      if (verbose) {
        console.debug.apply(console, args);
      }
    };

    this.suppressChange = false;
    this.codeMirrorBeforeChange = (...args) => {
      this.beforeLocalChange(...args);
    };
    this.codeMirrorChanges = (...args) => {
      this.afterLocalChanges(...args);
    };
    this.shareDBOp = (...args) => {
      this.onRemoteChange(...args);
    };
    this.shareDBDel = (...args) => {
      this.onDocDelete(...args);
    };
    this.shareDBError = (...args) => {
      this.onDocError(...args);
    };
  }

  /**
   * Starts listening for changes from the CodeMirror instance and the ShareDB
   * document. For CodeMirror, it is necessary to register for both
   * `beforeChange` and `changes` events: the first one is the only one to
   * report the positions in the pre-change coordinate system, while the latter
   * marks the end of the batch of operations.
   */
  start() {
    var doc = this.doc;
    var codeMirror = this.codeMirror;
    if (!doc.cm || doc.cm.version !== doc.version) {
      var cmDoc = new codeMirror.constructor.Doc(get(doc.data, this.key));
      doc.cm = { doc: cmDoc };
    }
    codeMirror.swapDoc(doc.cm.doc);
    codeMirror.on('beforeChange', this.codeMirrorBeforeChange);
    codeMirror.on('changes', this.codeMirrorChanges);
    doc.on('op', this.shareDBOp);
    doc.on('del', this.shareDBDel);
    doc.on('error', this.shareDBError);
  }

  /**
   * Stops listening for changes from the CodeMirror instance and the ShareDB document.
   */
  detachDoc() {
    var doc = this.doc;
    if (!doc) {
      return;
    }
    doc.cm.version = doc.version;
    var codeMirror = this.codeMirror;
    codeMirror.off('beforeChange', this.codeMirrorBeforeChange);
    codeMirror.off('changes', this.codeMirrorChanges);
    doc.removeListener('op', this.shareDBOp);
    doc.removeListener('del', this.shareDBDel);
    doc.removeListener('error', this.shareDBError);
    delete this.doc;
    this.log('ShareDBCodeMirror: unsubscribed from doc');
  }


  /**
   * Applies the changes represented by the given array of OT operations. It
   * may be ignored if they are an echo of the most recently submitted local
   * operations.
   */
  onRemoteChange(ops, source) {
    console.log(ops, source,this.source);
    if (source === this.source) {
      console.log('returning because source')
      return;
    }

    this.log('ShareDBCodeMirror: applying ops', ops);
    this.suppressChange = true;
    for (var part of ops) {
      if (!(part.p && isEqual(part.p ,this.key) && part.t === 'text0')) {
        this.log(
          'ShareDBCodeMirror: ignoring op because of path or type:',
          part
        );
        continue;
      }

      var op = part.o;
      var codeMirror = this.codeMirror;
      if (op.length === 2 && op[0].d && op[1].i && op[0].p === op[1].p) {
        // replace operation
        var from = codeMirror.posFromIndex(op[0].p);
        var to = codeMirror.posFromIndex(op[0].p + op[0].d.length);
        codeMirror.replaceRange(op[1].i, from, to);
      } else {
        for (part of op) {
          var from = codeMirror.posFromIndex(part.p);
          if (part.d) {
            // delete operation
            var to = codeMirror.posFromIndex(part.p + part.d.length);
            codeMirror.replaceRange('', from, to);
          } else if (part.i) {
            // insert operation
            codeMirror.replaceRange(part.i, from);
          }
        }
      }
    }
    this.suppressChange = false;
  }

  onDocDelete(data, source) {
    this.detachDoc();
    this.codeMirror.setValue('Document deleted');
  }

  onDocError(error) {
    this.errorHandler(error);
  }

  /**
   * Callback for the CodeMirror `beforeChange` event. It may be ignored if it
   * is an echo of the most recently applied remote operations, otherwise it
   * collects all the operations which are later sent to the server.
   */
  beforeLocalChange(codeMirror, change) {
    if (this.suppressChange) {
      return;
    }

    if (!this.ops) {
      this.ops = [];
    }
    var index = this.codeMirror.indexFromPos(change.from);
    if (change.from !== change.to) {
      // delete operation
      var deleted = codeMirror.getRange(change.from, change.to);
      this.ops.push({ p: index, d: deleted });
    }
    if (change.text[0] !== '' || change.text.length > 0) {
      // insert operation
      var inserted = change.text.join('\n');
      console.log(index, inserted);
      this.ops.push({ p: index, i: inserted });
    }
  }

  /**
   * Callback for the CodeMirror `changes` event. It may be ignored if it is
   * an echo of the most recently applied remote operations, otherwise it
   * sends the previously collected operations to the server.
   */
  afterLocalChanges(codeMirror, changes) {
    if (this.suppressChange) {
      return;
    }

    var op = [{ p: this.key, t: 'text0', o: this.ops }];
    delete this.ops;
    this.log('ShareDBCodeMirror: submitting op', op);
    this.doc.submitOp(op, { source: this.source }, error => {
      if (error) {
        this.errorHandler(error);
      }
    });

  }
}
module.exports = ShareDBCodeMirror;
