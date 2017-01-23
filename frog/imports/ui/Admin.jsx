import React, { Component } from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'

import { Logs } from '../api/logs';
import { Sessions, importSession } from '../api/sessions';
import { Activities, Operators, importActivity, importOperator, deleteDatabase } from '../api/activities';
import { Graphs, importGraph } from '../api/graphs';
import { $ } from 'meteor/jquery'

const planeNames = ['class', 'group', 'individual']

function download(strData, strFileName, strMimeType) {
    var D = document,
        A = arguments,
        a = D.createElement("a"),
        d = A[0],
        n = A[1],
        t = A[2] || "text/plain";

    //build download link:
    a.href = "data:" + strMimeType + "charset=utf-8," + escape(strData);

    if (window.MSBlobBuilder) { // IE10
        var bb = new MSBlobBuilder();
        bb.append(strData);
        return navigator.msSaveBlob(bb, strFileName);
    } /* end if(window.MSBlobBuilder) */

    if ('download' in a) { //FF20, CH19
        a.setAttribute("download", n);
        a.innerHTML = "downloading...";
        D.body.appendChild(a);
        setTimeout(function() {
            var e = D.createEvent("MouseEvents");
            e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            a.dispatchEvent(e);
            D.body.removeChild(a);
        }, 66);
        return true;
    }; /* end if('download' in a) */

    //do iframe dataURL download: (older W3)
    var f = D.createElement("iframe");
    D.body.appendChild(f);
    f.src = "data:" + (A[2] ? A[2] : "application/octet-stream") + (window.btoa ? ";base64" : "") + "," + (window.btoa ? window.btoa : escape)(strData);
    setTimeout(function() {
        D.body.removeChild(f);
    }, 333);
    return true;
}

export default createContainer(
  () => {
    const sessions = Sessions.find().fetch()
    const graphs = Graphs.find().fetch()
    const activities = Activities.find().fetch()
    const operators = Operators.find().fetch()
    return ({ sessions, graphs, activities, operators })
  },
  ({ sessions, graphs, activities, operators }) => {

    const exportToJSON = () => {
      var obj = {
        'sessions': sessions,
        'graphs': graphs,
        'activities': activities,
        'operators': operators
      }
      const str = 'database.json'
      download(JSON.stringify(obj), str, 'text/plain');
    }

    const importFromJSON = () => {
      console.log(document.getElementById("json-database").files[0])
      var files = document.getElementById('json-database').files;
      if (files.length <= 0) {
        return false;
      }
      var fr = new FileReader();
      fr.onload = function(e) { 
        var obj = JSON.parse(e.target.result);
        console.log(obj)
        var objstr = JSON.stringify(obj, null, 2);
        if (obj.hasOwnProperty('sessions') && obj.hasOwnProperty('graphs') && obj.hasOwnProperty('activities') && obj.hasOwnProperty('operators')){
          deleteDatabase()
          for (var i = 0; i < obj.graphs.length; i++){
            importGraph(obj.graphs[i])
          }
          for (var i = 0; i < obj.sessions.length; i++){
            importSession(obj.sessions[i])
          }
          for (var i = 0; i < obj.activities.length; i++){
            importActivity(obj.activities[i])
          }
          for (var i = 0; i < obj.operators.length; i++){
            importOperator(obj.operators[i])
          }
          console.log('Database uploaded')
        } else {
          console.log('Database unrecognised')
        }
      }
      fr.readAsText(files.item(0));
    }

    const exportLogs = () => {
      var obj = {
        'logs': Logs.find().fetch()
      }
      const str = 'logs.json'
      download(JSON.stringify(obj), str, 'text/plain');
    }

    return(
      <div>
        <button className='export database' onClick={() => exportToJSON()}>Download the database</button>
        <form encType="multipart/form-data" action="upload" method="post">
          <input id="json-database" type="file" />
        </form>
        <button className='import database' onClick={() => importFromJSON()}>Upload a database</button>
        <br/>
        <button className='delete database' onClick={() => deleteDatabase()}>Delete the database</button>
        <br/>
        <button className='export logs' onClick={() => exportLogs()}>Download the Logs</button>
      </div>
    )
  }
)
