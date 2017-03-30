import React from 'react';
import svg2pdf from 'svg2pdf.js';
import jsPDF from 'jspdf-yworks';

import { connect, store } from '../store';

const download = e => {
  e.preventDefault();

  const pdf = new jsPDF('l', 'pt', [4000, 600]);

  // render the svg element
  svg2pdf(store.ui.svgRef, pdf, {
    xOffset: 0,
    yOffset: 0,
    scale: 1
  });

  // get the data URI
  const uri = pdf.output('datauristring');
  const link = document.createElement('a');
  link.href = uri;
  link.click();
};

export default connect(({
  store: { overlapAllowed, updateSettings, undo, canUndo, history }
}) => (
  <div className="topPanelUnit">
    <input
      type="checkbox"
      id="cbox"
      checked={overlapAllowed}
      onChange={e => {
        updateSettings({ overlapAllowed: e.target.checked });
      }}
    />

    <label htmlFor="cbox">Overlap allowed</label>
    {canUndo &&
      <a href="#" onClick={undo} style={{ marginLeft: '50px' }}>
        Undo ({history.length})
      </a>}
    &nbsp;
    <a href onClick={download}>Download as PDF</a>
  </div>
));
