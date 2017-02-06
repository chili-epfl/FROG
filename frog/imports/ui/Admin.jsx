import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { Logs } from '../api/logs';
import { Sessions, importSession } from '../api/sessions';
import {
  Activities,
  Operators,
  importActivity,
  importOperator,
  deleteDatabase
} from '../api/activities';
import { Graphs, importGraph } from '../api/graphs';

function download(strData, strFileName, strMimeType) {
  const D = this.document;
  const a = D.createElement('a');

  // build download link:
  a.href = 'data:' + strMimeType + 'charset=utf-8,' + escape(strData);

  if (
    this.window.MSBlobBuilder // IE10
  ) {
    const bb = new MSBlobBuilder(); // eslint-disable-line
    bb.append(strData);
    return this.navigator.msSaveBlob(bb, strFileName);
  } /* end if(window.MSBlobBuilder) */

  if (
    'download' in a // FF20, CH19
  ) {
    a.setAttribute('download', strFileName);
    a.innerHTML = 'downloading...';
    D.body.appendChild(a);
    setTimeout(
      function f1() {
        const e = D.createEvent('MouseEvents');
        e.initMouseEvent(
          'click',
          true,
          false,
          this.window,
          0,
          0,
          0,
          0,
          0,
          false,
          false,
          false,
          false,
          0,
          null
        );
        a.dispatchEvent(e);
        D.body.removeChild(a);
      },
      66
    );
    return true;
  } /* end if('download' in a) */

  // do iframe dataURL download: (older W3)
  const f = D.createElement('iframe');
  D.body.appendChild(f);
  f.src = 'data:' +
    (strMimeType || 'application/octet-stream') +
    (this.window.btoa ? ';base64' : '') +
    ',' +
    (this.window.btoa ? this.window.btoa : escape)(strData);
  setTimeout(
    function f2() {
      D.body.removeChild(this.f);
    },
    333
  );
  return true;
}

export default createContainer(
  () => {
    const sessions = Sessions.find().fetch();
    const graphs = Graphs.find().fetch();
    const activities = Activities.find().fetch();
    const operators = Operators.find().fetch();
    return { sessions, graphs, activities, operators };
  },
  ({ sessions, graphs, activities, operators }) => {
    const exportToJSON = () => {
      const obj = {
        sessions,
        graphs,
        activities,
        operators
      };
      const str = 'database.json';
      download(JSON.stringify(obj), str, 'text/plain');
    };
    const importFromJSON = () => {
      const files = this.document.getElementById('json-database').files;
      if (files.length <= 0) {
        return false;
      }
      const fr = new FileReader(); // eslint-disable-line
      fr.onload = function f3(e) {
        const obj = JSON.parse(e.target.result);
        if (
          Object.prototype.hasOwnProperty.call(obj, 'sessions') &&
            Object.prototype.hasOwnProperty.call(obj, 'graphs') &&
            Object.prototype.hasOwnProperty.call(obj, 'activities') &&
            Object.prototype.hasOwnProperty.call(obj, 'operators')
        ) {
          deleteDatabase();
          for (let i = 0; i < obj.graphs.length; i += 1) {
            importGraph(obj.graphs[i]);
          }
          for (let i = 0; i < obj.sessions.length; i += 1) {
            importSession(obj.sessions[i]);
          }
          for (let i = 0; i < obj.activities.length; i += 1) {
            importActivity(obj.activities[i]);
          }
          for (let i = 0; i < obj.operators.length; i += 1) {
            importOperator(obj.operators[i]);
          }
        }
      };
      fr.readAsText(files.item(0));
      return true;
    };
    const exportLogs = () => {
      const obj = {
        logs: Logs.find().fetch()
      };
      const str = 'logs.json';
      download(JSON.stringify(obj), str, 'text/plain');
    };
    return (
      <div>
        <button className="export database" onClick={() => exportToJSON()}>
          Download the database
        </button>
        <form encType="multipart/form-data" action="upload" method="post">
          <input id="json-database" type="file" />
        </form>
        <button className="import database" onClick={() => importFromJSON()}>
          Upload a database
        </button>
        <br />
        <button className="delete database" onClick={() => deleteDatabase()}>
          Delete the database
        </button>
        <br />
        <button className="export logs" onClick={() => exportLogs()}>
          Download the Logs
        </button>
      </div>
    );
  }
);
