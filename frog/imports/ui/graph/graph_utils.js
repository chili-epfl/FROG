import { $ } from 'meteor/jquery'


export const computeTopPositionFromGraph = (object, graphId) => {
  let inner = $("#" + graphId + "inner_graph").offset().top
  let elem = $(object).offset().top
  return elem - inner
}

export const computeLeftPositionFromGraph = (object, graphId) => {
  let inner = $("#" + graphId + "inner_graph").offset().left
  let elem = $(object).offset().left
  return elem - inner
}

export const scrollGraph = (time, graphId) => {
  $("#" + graphId + 'inner_graph').scrollLeft(time);
}

export const convertTimeToPx = (unit, time) => {
  return time / getUnitInSeconds(unit) * horizontalZoom
}

export const convertPxToTime = (unit, time) => {
  return time * getUnitInSeconds(unit) / horizontalZoom
}

export const getUnitInSeconds = (unit) => {
  switch(unit) {
    case 'days':
      return 86400.0;
    case 'hours':
      return 3600.0;
    case 'minutes':
      return 60.0;
    default: return 1.0;
  }
}

export const scales = ['seconds', 'minutes', 'hours', 'days']
export const leftMargin = 10;
const charSize = 11;
export const textSizeAndMargin = charSize*10 + leftMargin;
export const interval = 30;
export const horizontalZoom = 3;
export const graphSize = 330;
