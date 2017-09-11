import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ResizeAware from 'react-resize-aware';
import styled from 'styled-components';
import { withState } from 'recompose';

import ObservationContainer from './obs_container';
import ObservationDetail from './obs_detail';

const Quadrants = ({ config, width, height }) =>
  <div>
    <Item
      group="a"
      key="a"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: height / 2,
        width: width / 2
      }}
    >
      {config.quadrant1}
    </Item>
    <Item
      group="b"
      key="b"
      style={{
        position: 'absolute',
        top: 0,
        left: width / 2,
        height: height / 2,
        width: width / 2
      }}
    >
      {config.quadrant2}
    </Item>
    <Item
      group="c"
      key="c"
      style={{
        position: 'absolute',
        top: height / 2,
        left: 0,
        height: height / 2,
        width: width / 2
      }}
    >
      {config.quadrant3}
    </Item>
    <Item
      group="d"
      key="d"
      style={{
        position: 'absolute',
        top: height / 2,
        left: width / 2,
        height: height / 2,
        width: width / 2
      }}
    >
      {config.quadrant4}
    </Item>
  </div>;

const BoardPure = ({
  activityData: { config },
  data,
  dataFn,
  width,
  height,
  info,
  setInfo
}) => {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      {config.quadrants &&
        <Quadrants config={config} width={width} height={height} />}
      <p>
        {width}
      </p>
      <p>
        {height}
      </p>
    </div>
  );
};

const Board = withState('info', 'setInfo', null)(BoardPure);

export default props =>
  <ResizeAware style={{ position: 'relative', height: '100%', width: '100%' }}>
    <Board {...props} />
  </ResizeAware>;

// componentDidMount() {
//   this.updateRefs();
// }

// componentDidUpdate() {
//   this.updateRefs();
// }

// updateRefs = () => {
//   const ref = this.imgref || this.divref;
//   this.parentElem = ref ? findDOMNode(ref) : null;
// };

// render() {
//   const { config } = this.props.activityData;
//   const { data, dataFn } = this.props;
//   const List = data.map((y, i) => {
//     const openInfoFn = () => this.setState({ info: y });
//     const setXY = (_, ui) => {
//       dataFn.objInsert(ui.x, [i, 'x']);
//       dataFn.objInsert(ui.y, [i, 'y']);
//     };

//     return (
//       <ObservationContainer
//         key={y.id}
//         parent={this.parentElem}
//         setXY={setXY}
//         openInfoFn={openInfoFn}
//         observation={y}
//       />
//     );
//   });

//   return (
//     <MuiThemeProvider>
//       <Container ref={ref => (this.divref = ref)}>
//         {config.quadrants && [
//           <Item group="a" key="a">
//             {config.quadrant1}
//           </Item>,
//           <Item group="b" key="b">
//             {config.quadrant2}
//           </Item>,
//           <Item group="c" key="c">
//             {config.quadrant3}
//           </Item>,
//           <Item group="d" key="d">
//             {config.quadrant4}
//           </Item>
//         ]}
//         {config.image &&
//           <BackgroundImage
//             ref={ref => (this.imgref = ref)}
//             src={config.imageurl}
//             alt="Background"
//           />}
//         {List}
//         {this.state.info &&
//           <ObservationDetail
//             observation={this.state.info}
//             closeInfoFn={() => this.setState({ info: null })}
//           />}
//       </Container>
//     </MuiThemeProvider>
//   );
// }
// }

// export default Cluster;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: relative;
  left: 0px;
  top: 0px;
`;

const BackgroundImage = styled.img`
  width: 100%;
  object-fit: contain;
`;

const colors = {
  a: '#e7ffac',
  b: '#fbe4ff',
  c: '#dcd3ff',
  d: '#ffccf9'
};

const Item = styled.div`background: ${props => colors[props.group]};`;
