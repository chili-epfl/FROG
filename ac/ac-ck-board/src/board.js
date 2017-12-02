// @flow
import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ResizeAware from 'react-resize-aware';
import { withState, compose } from 'recompose';
import { type ActivityRunnerT } from 'frog-utils';
import { every, compact, omit, isEqual, flatten } from 'lodash';
import Draggable from 'react-draggable';
import Checkbox from 'material-ui/Checkbox';

import ObservationContainer from './obs_container';
import ObservationDetail from './obs_detail';
import Quadrants from './Quadrants';
import { Plus } from './Plus';
import AddBox from './AddBox';
import { uuid } from 'frog-utils';

const CategoryList = ({ categories, setCategories, categoriesSet }) => {
  const newcategoriesSet = {
    ...Object.keys(categories).reduce(
      (acc, cat) => ({ ...acc, [cat]: [] }),
      {}
    ),
    ...categoriesSet
  };
  return (
    <Draggable onStart={() => true} defaultPosition={{ x: 200, y: 300 }}>
      <div
        style={{
          zIndex: 99,
          border: '1px solid',
          width: '150px',
          position: 'fixed',
          top: '200px',
          left: '200px',
          background: 'lightgreen'
        }}
      >
        {Object.keys(categories).map(gencat =>
          <div key={gencat}>
            <h4>
              {gencat}
            </h4>
            {categories[gencat].map(cat =>
              <Checkbox
                key={cat}
                label={cat}
                onCheck={(_, checked) =>
                  checked
                    ? setCategories({
                        ...newcategoriesSet,
                        [gencat]: [
                          ...new Set([...(newcategoriesSet[gencat] || {}), cat])
                        ]
                      })
                    : setCategories({
                        ...newcategoriesSet,
                        [gencat]: (newcategoriesSet[gencat] || {})
                          .filter(x => x !== cat)
                      })}
                checked={
                  newcategoriesSet[gencat] &&
                  newcategoriesSet[gencat].includes(cat)
                }
              />
            )}
            <i>
              <Checkbox
                key="all"
                label="All/none"
                onCheck={(_, checked) =>
                  checked
                    ? setCategories({
                        ...newcategoriesSet,
                        [gencat]: categories[gencat]
                      })
                    : setCategories({ ...newcategoriesSet, [gencat]: [] })}
                checked={isEqual(categories[gencat], newcategoriesSet[gencat])}
              />
            </i>
          </div>
        )}
      </div>
    </Draggable>
  );
};

const BoardPure = ({
  activityData: { config },
  data,
  dataFn,
  width,
  height,
  info,
  setInfo,
  newOpen,
  setOpen,
  setCategories,
  categoriesSet
}) => {
  const scaleX = 1000 / width;
  const scaleY = 1000 / height;
  const offsetHeight = 100 / scaleY / 2;
  const offsetWidth = 300 / scaleX / 2;
  const setXY = (i, ui) => {
    dataFn.objInsert((ui.x + offsetWidth) * scaleX, [i, 'x']);
    dataFn.objInsert((ui.y + offsetHeight) * scaleY, [i, 'y']);
  };

  const categoryKeys = [
    ...new Set(
      flatten(compact(data.map(x => x.category && Object.keys(x.category))))
    )
  ];

  const categories = categoryKeys.reduce(
    (acc, key) => ({
      ...acc,
      [key]: [...new Set(data.map(x => x.category && x.category[key]))]
    }),
    {}
  );

  const submitFn = item => {
    setOpen(false);
    if (item) {
      const items = item.split(';').map(f => f.trim());
      items.forEach(it =>
        dataFn.listAppend({
          id: uuid(),
          title: it,
          x: 300 + Math.random() * 400,
          y: -300 - Math.random() * 400
        })
      );
    }
  };

  const List = data.map(
    (y, i) =>
      every(
        Object.keys(categories),
        cat =>
          !categoriesSet[cat] || categoriesSet[cat].includes(y.category[cat])
      )
        ? <div key={y.id}>
            <ObservationContainer
              setXY={(_, ui) => setXY(i, ui)}
              openInfoFn={() => setInfo(y)}
              title={y.title}
              scaleY={scaleY}
              scaleX={scaleX}
              content={y.content}
              x={y.x / scaleX - offsetWidth}
              y={y.y / scaleY - offsetHeight}
              delBox={() => dataFn.listDel(y, i)}
            />
          </div>
        : null
  );
  if (!width || !height) {
    return null;
  }
  return (
    <MuiThemeProvider>
      <div style={{ height: '100%', width: '100%' }}>
        {config.quadrants &&
          <Quadrants config={config} width={width} height={height} />}
        {config.image &&
          <img
            src={config.imageurl}
            alt="Background"
            style={{ width: width + 'px', height: height + 'px' }}
          />}
        {width && height && List}
        {info &&
          <ObservationDetail
            title={info.title}
            content={info.content}
            closeInfoFn={() => setInfo(null)}
          />}
        <Plus scaleX={scaleX} scaleY={scaleY} openFn={() => setOpen(true)} />
        {newOpen && <AddBox submitFn={submitFn} />}
        {Object.keys(categories).length > 0 &&
          <CategoryList
            categories={categories}
            setCategories={setCategories}
            categoriesSet={categoriesSet}
          />}
      </div>
    </MuiThemeProvider>
  );
};

const Board = compose(
  withState('info', 'setInfo', null),
  withState('newOpen', 'setOpen', false),
  withState('categoriesSet', 'setCategories', {})
)(BoardPure);

export default (props: ActivityRunnerT) =>
  <ResizeAware style={{ position: 'relative', height: '100%', width: '100%' }}>
    <Board {...props} />
  </ResizeAware>;
