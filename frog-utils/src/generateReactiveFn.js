// @flow
import * as React from 'react';
import ShareDB from 'sharedb';
import StringBinding from 'sharedb-string-binding';
import { get } from 'lodash';

import { uploadFile } from '/imports/api/openUploads';
import { uuid } from './index';

type rawPathElement = string | number;
type rawPathT = rawPathElement | rawPathElement[];

const cleanPath = (
  defPath: rawPathElement[],
  rawPath: rawPathT = []
): rawPathElement[] => {
  const newPath = Array.isArray(rawPath) ? rawPath : [rawPath];
  return [...defPath, ...newPath];
};

export class ReactiveDoc {
  doc: any;
  path: rawPathElement[];
  submitOp: Function;
  readOnly: boolean;
  updateFn: ?Function;
  LearningItemFn: any;
  meta: Object;
  stream: ?Function;
  path: rawPathElement[];
  sessionId: string;
  uploadFn: Function;

  constructor(
    doc: any,
    options: {
      path?: rawPathElement[],
      readOnly?: boolean,
      updateFn?: Function,
      meta?: Object,
      LearningItem: any,
      stream?: Function,
      sessionId?: string
    }
  ) {
    this.stream = options.stream;
    this.meta = options.meta || {};
    this.readOnly = !!options.readOnly;
    this.doc = doc;
    this.path = options.path || [];
    this.sessionId = options.sessionId || '';
    this.uploadFn = (file, name) => uploadFile(file, name, this.sessionId);
    this.submitOp = options.readOnly
      ? () => options.updateFn && options.updateFn()
      : e => {
          doc.submitOp(e);
        };
    this.updateFn = options.updateFn;
    this.LearningItemFn = options.LearningItem;
  }

  createLearningItem(
    liType: string,
    payload?: Object,
    meta?: Object,
    immutable: boolean = false
  ): string | Object {
    const id = uuid();
    const properPayload =
      // $FlowFixMe
      payload || new this.LearningItemFn().getEmptyDataStructure(liType);
    const newLI = {
      liType,
      payload: properPayload,
      createdAt: new Date(),
      ...meta,
      ...this.meta
    };
    if (immutable) {
      return { id, liDocument: newLI };
    } else {
      const itempointer = this.doc.connection.get('li', id);
      itempointer.create(newLI);
      itempointer.subscribe();
      return id;
    }
  }

  LearningItem = (props: any) => {
    const LI = this.LearningItemFn;
    return <LI {...props} dataFn={this} />;
  };

  createLIPayload = (
    type: string,
    payload: Object,
    autoInsert: boolean,
    meta?: Object
  ) =>
    // $FlowFixMe
    new this.LearningItemFn({
      liType: type,
      payload,
      type: 'createLIPayload',
      autoInsert,
      dataFn: this,
      meta
    }).render();

  bindTextField(ref: any, rawpath: rawPathT) {
    const path = cleanPath(this.path, rawpath);
    if (typeof get(this.doc.data, path) !== 'string') {
      // eslint-disable-next-line no-console
      console.error(
        `Cannot use bindTextField on path that is not initialized as a string, path: ${JSON.stringify(
          path
        )}, value ${get(this.doc.data, path)}, doc.data: ${JSON.stringify(
          this.doc.data
        )}.`
      );
    }
    const binding = new StringBinding(ref, this.doc, path);
    binding.setup();
    return binding;
  }

  listPrepend(newVal: any, path: rawPathT) {
    this.submitOp({ p: [...cleanPath(this.path, path), 0], li: newVal });
  }

  listAppend(newVal: any, path: rawPathT) {
    this.submitOp({
      p: [...cleanPath(this.path, path), 999999],
      li: newVal
    });
  }

  listAppendLI(
    liType: string,
    payload: Object,
    meta: Object,
    path: rawPathT,
    immutable: boolean
  ) {
    const liID = this.createLearningItem(liType, payload, meta, immutable);
    this.submitOp({
      p: [...cleanPath(this.path, path), 999999],
      li: liID
    });
  }

  listInsert(newVal: any, path: rawPathT) {
    this.submitOp({
      p: cleanPath(this.path, path),
      li: newVal
    });
  }

  listDel(oldVal: any, path: rawPathT) {
    this.submitOp({
      p: cleanPath(this.path, path),
      ld: oldVal
    });
  }

  listReplace(oldVal: any, newVal: any, path: rawPathT) {
    this.submitOp({
      p: cleanPath(this.path, path),
      ld: oldVal,
      li: newVal
    });
  }

  numIncr(incr: number, path: rawPathT) {
    this.doc.preventCompose = true;
    this.submitOp({ p: cleanPath(this.path, path), na: incr });
  }

  objInsert(newVal: any, path: rawPathT) {
    this.submitOp({ p: cleanPath(this.path, path), oi: newVal });
  }

  keyedObjInsert(newVal: Object, path: rawPathT) {
    const id = uuid();
    const aryPath = Array.isArray(path) ? path : [path];
    this.submitOp({
      p: cleanPath(this.path, [...aryPath, id]),
      oi: { id, ...newVal }
    });
  }

  objDel(oldVal: Object, path: rawPathT) {
    this.submitOp({ p: cleanPath(this.path, path), od: oldVal });
  }

  objReplace(oldVal: Object, newVal: Object, path: rawPathT) {
    this.submitOp({
      p: cleanPath(this.path, path),
      od: oldVal,
      oi: newVal
    });
  }

  objSet(newVal: Object, path: rawPathT) {
    this.submitOp({
      p: [...this.path, path],
      oi: newVal
    });
  }

  specialize(rawPath: rawPathT) {
    const newPath = Array.isArray(rawPath) ? rawPath : [rawPath];
    return new ReactiveDoc(this.doc, {
      path: [...this.path, ...newPath],
      readOnly: this.readOnly,
      updateFn: this.updateFn || (_ => {}),
      meta: this.meta,
      LearningItem: this.LearningItemFn
    });
  }

  specializeData(path: rawPathT, data: Object) {
    if (typeof path === 'string' || typeof path === 'number') {
      return data[[path]];
    }
    return path.reduce((acc, x) => acc[[x]], data);
  }
}

export const inMemoryReactive = (
  initial: any,
  LearningItem: any
): Promise<{ data: any, dataFn: ReactiveDoc }> => {
  const share = new ShareDB();
  const connection = share.connect();

  return new Promise(resolve => {
    const doc = connection.get('coll', uuid());
    doc.subscribe();
    doc.on('load', () => {
      doc.create(initial);
      resolve(doc);
    });
  }).then(doc => ({
    data: doc,
    dataFn: new ReactiveDoc(doc, { path: [], LearningItem })
  }));
};
