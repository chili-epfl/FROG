// @flow

import React from 'react';
import { Chat, type ActivityPackageT, type ActivityRunnerT } from 'frog-utils';
import styled from 'styled-components';

import Dashboard from './Dashboard';

const meta = {
  name: 'Embedded website',
  type: 'react-component'
};

const config = {
  type: 'object',
  properties: {
    url: {
      type: 'string',
      title: 'Default URL'
    },
    perRole: {
      type: 'array',
      title: 'URL to provide to specific roles',
      items: {
        type: 'object',
        properties: {
          role: {
            type: 'string',
            title: 'Role'
          },
          content: {
            type: 'string',
            title: 'URL'
          }
        }
      }
    }
  }
};

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: 100%;
`;

const IframeContainer = styled.div`
  padding: 2%;
  width: 70%;
`;

const ChatContainer = styled.div`
  padding: 2%;
  width: 30%;
`;

const ActivityRunner = (
  {
    configData,
    object,
    userInfo,
    logger,
    reactiveFn,
    reactiveData
  }: ActivityRunnerT
) => {
  const urlPerRole = (configData.perRole &&
    configData.perRole.reduce(
      (acc, item) => ({ ...acc, [item.role]: item.content }),
      { default: configData.url }
    )) || { default: configData.url };

  const socialStructure = object.socialStructures.find(x => x[userInfo.id]);
  const role = (socialStructure && socialStructure[userInfo.id].role) ||
    'default';

  return (
    <div>
      <b>Role: {role}</b>
      <Container>
        <IframeContainer>
          <iframe src={urlPerRole[role]} width="100%" height="600px" />
        </IframeContainer>
        <ChatContainer>
          <Chat
            messages={reactiveData.list.filter(x => x.groupId === role)}
            userInfo={userInfo}
            addMessage={reactiveFn(role).listAdd}
            logger={logger}
          />
        </ChatContainer>
      </Container>
    </div>
  );
};

export default ({
  id: 'ac-iframe',
  ActivityRunner,
  Dashboard,
  config,
  meta
}: ActivityPackageT);
