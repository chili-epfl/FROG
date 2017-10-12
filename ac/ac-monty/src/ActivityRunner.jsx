// @flow

import React from 'react';
import { uuid, TableView, TreeView, toTableData, type ActivityRunnerT } from 'frog-utils';
import styled from 'styled-components';
import { Nav, NavItem, Button } from 'react-bootstrap';
import { withState } from 'recompose';

const NewTab = ({ addTab }) =>
  <div className="well" style={{maxWidth: 400, margin: 'auto'}}>
    <Button bsStyle="primary" bsSize="large" block onClick={() => addTab('table')}>Utiliser un tableau</Button>
    <Button bsStyle="primary" bsSize="large" block onClick={() => addTab('tree')}>Utiliser un arbre</Button>
  </div>

const TabHeader = ({ tab, stream }) => {
    return (
      <div style={{margin: '10px auto 10px', width: '300px'}}>
        <Button bsStyle="success" bsSize="large" block onClick={() => stream(tab, [tab.key])}>Valider cette solution</Button>
      </div>
  )
}

const TabView = (props) => {
  const { tab, data, dataFn, stream } = props

  return (
    <div style={{margin: 'auto', width: '100%'}}>
      <TabHeader {...props} />
      { tab.type === 'table'
        ? <TableView
            onCellValueChange={(event) => {
              const [cell, newValue] = event
              if(data[tab.key]['data'][cell[0].toString()]) {
                dataFn.objInsert(newValue, [tab.key, 'data', cell[0].toString(), cell[1].toString()])
              } else {
                dataFn.objInsert({ [cell[1].toString()]: newValue }, [tab.key, 'data', cell[0].toString() ])
              }
            }}
            initialData={toTableData(tab.data, 10, 5)}
          />
        : <TreeView />
      }
    </div>
  )
}

// the actual component that the student sees
const ActivityRunner = (props) => {

  const {
    logger,
    activityData,
    data,
    dataFn,
    userInfo,
    activeTab,
    setActiveTab,
    stream
  } = props

  const tabs = Object.keys(data)
    .filter(k => data[k].type && data[k].key)
    .map(k => data[k])

  const addTab = (type) => {
    const key = uuid()
    const data = (type === 'table')
      ? { '0': {
        '0': 'La montre est derrière',
        '1': 'Choix initial',
        '2': 'HEC ouvre la porte',
        '3': 'Change de choix',
        '4': 'Ne change pas'
      }, '1': {
        '0': 'A',
        '1': 'A',
        '2': 'B ou C',
        '3': 'A',
        '4': 'C ou B'
      }}
      : {}
    dataFn.objInsert({type, key, data}, key)
    setActiveTab(key)
  }

  return (
    <div style={{height: '100%'}}>
      <Nav bsStyle="tabs" activeKey={activeTab} onSelect={(key) => setActiveTab(key)}>
        { tabs && tabs.map((tab, i) =>
          <NavItem key={tab.key} eventKey={tab.key}>{i + 1}</NavItem>
        )}
        <NavItem eventKey="new">+</NavItem>
      </Nav>
      { activeTab == 'new'
        ? <NewTab addTab={addTab}/>
      : <TabView tab={data[activeTab]} {...props} />
      }
    </div>
  )
}

export default withState('activeTab', 'setActiveTab', 'new')(ActivityRunner);
