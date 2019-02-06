// @flow
import * as React from 'react';
import ShareDB from 'sharedb';
import StringBinding from 'sharedb-string-binding';
import { get } from 'lodash';
import { uuid, type LearningItemComponentT, isBrowser } from 'frog-utils';
import { uploadFile } from '/imports/api/openUploads';
import { learningItemTypesObj } from '/imports/activityTypes';

export const listore = isBrowser
  ? require('/imports/client/LearningItem/store').listore // eslint-disable-line global-require
  : () => {};

type rawPathElement = string | number;
type rawPathT = rawPathElement | rawPathElement[];

const cleanPath = (
  defPath: rawPathElement[],
  rawPath: rawPathT = []
): rawPathElement[] => {
  const newPath = Array.isArray(rawPath) ? rawPath : [rawPath];
  return [...defPath, ...newPath];
};

export class Doc {
  doc: any;

  path: rawPathElement[];

  submitOp: Function;

  readOnly: boolean;

  updateFn: ?Function;

  LearningItemFn: LearningItemComponentT;

  meta: Object;

  backend: any;

  stream: ?Function;

  path: rawPathElement[];

  sessionId: string;

  uploadFn: Function;

  LIConnection: any;

  listore: Object;

  constructor(
    doc: any,
    path?: rawPathElement[],
    readOnly: boolean,
    updateFn?: Function,
    meta: Object = {},
    LearningItem: LearningItemComponentT,
    backend: any,
    stream?: Function,
    sessionId?: string,
    LIConnection: any
  ) {
    this.stream = stream;
    this.backend = backend;
    this.meta = meta;
    this.readOnly = !!readOnly;
    this.doc = doc;
    this.path = path || [];
    this.sessionId = sessionId || '';
    this.LIConnection = LIConnection;
    this.uploadFn = (file, name) => uploadFile(file, name, this.sessionId);
    this.submitOp = readOnly
      ? () => updateFn && updateFn()
      : e => {
          doc.submitOp(e);
        };
    this.updateFn = updateFn;
    this.LearningItemFn = LearningItem;
    this.listore = listore;
  }

  getMergedPath(path: rawPathT): * {
    return cleanPath(this.path, path);
  }

  getLearningTypesObj = (): Object => learningItemTypesObj;

  createLearningItem(
    liType: string,
    payload?: Object,
    meta?: Object,
    immutable: boolean = false
  ): ?(string | Object) {
    const id = uuid();
    const properPayload =
      // $FlowFixMe
      payload || learningItemTypesObj[liType].dataStructure;
    if (!properPayload) {
      return null;
    }
    const newLI = {
      liType,
      payload: properPayload,
      createdAt: new Date(),
      ...(meta || {}),
      ...this.meta
    };
    if (immutable) {
      return { id, liDocument: newLI };
    } else {
      const itempointer = (this.LIConnection || this.doc.connection).get(
        'li',
        id
      );
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
    autoInsert?: boolean,
    meta?: Object
  ) => {
    const liType = learningItemTypesObj[type];
    if (liType.createPayload) {
      const newDoc = new Doc(
        this.doc,
        this.path,
        this.readOnly,
        this.updateFn || (_ => {}),
        meta,
        this.LearningItemFn,
        this.backend
      );
      liType.createPayload(payload, newDoc, (...props) => {
        const li = this.createLearningItem(...props);
        if (autoInsert) {
          const id = uuid();
          this.objInsert({ li, id, ...(this.meta || {}) }, id);
          if (this.stream) {
            this.stream({ li });
          }
        }
      });
    }
  };

  duplicateLI = async (li: string) => {
    const connection = this.LIConnection || this.doc.connection;
    console.log(li);
    const newLI = await new Promise(resolve => {
      const doc = connection.get('li', li);
      doc.fetch();
      if (doc.type) {
        resolve(doc.data);
      }

      doc.once('load', () => {
        resolve(doc.data);
      });
    });

    const id = uuid();
    const itempointer = (this.LIConnection || this.doc.connection).get(
      'li',
      id
    );
    itempointer.create(newLI);
    itempointer.subscribe();
    console.log(id);
    return id;
  };

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
    return new Doc(
      this.doc,
      [...this.path, ...newPath],
      this.readOnly,
      this.updateFn || (_ => {}),
      this.meta,
      this.LearningItemFn,
      this.backend
    );
  }

  specializeData(path: rawPathT, data: Object) {
    if (typeof path === 'string' || typeof path === 'number') {
      return data[[path]];
    }
    // $FlowFixMe
    return path.reduce((acc, x) => acc[[x]], data);
  }
}

export const generateReactiveFn = (
  doc: any,
  LearningItem: any,
  meta?: Object,
  readOnly?: boolean,
  updateFn?: Function,
  backend?: any,
  stream?: Function,
  sessionId?: string,
  LIconnection?: any
): Object =>
  new Doc(
    doc,
    [],
    !!readOnly,
    updateFn,
    meta,
    LearningItem,
    backend,
    stream,
    sessionId,
    LIconnection
  );

export const inMemoryReactive = (
  initial: any,
  LearningItem: any,
  backend: any
): Promise<{ data: any, dataFn: Doc }> => {
  const share = new ShareDB({
    disableDocAction: true,
    disableSpaceDelimitedActions: true
  });
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
    dataFn: new Doc(doc, [], false, undefined, undefined, LearningItem, backend)
  }));
};
