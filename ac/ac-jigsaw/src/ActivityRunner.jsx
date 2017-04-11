export const ActivityRunner = (art: ActivityRunnerT) => {
  const {
    configData,
    object,
    userInfo,
    reactiveData,
    reactiveFn,
    logger
  } = art;

  const { socialStructures } = object;
  const roles = configData.roles.split(',');
  const texts = configData.text.split(',');
  const matching = {};
  roles.forEach((role, index) => matching[role] = texts[index]);

  const userRole = socialStructures[0][userInfo.id].role;
  const userGroup = socialStructures[0][userInfo.id].group;

  // collabGroup is either the name of the group or ofhte role, depending on what has been configured
  const collabGroup = socialStructures[0][userInfo.id][configData.groupBy];

  const reactiveKey = reactiveData.keys.filter(x => x.groupId === collabGroup)[
    0
  ];

  return (
    <div>
      <h1>{configData.title}</h1>
      <p>Your role is {userRole}</p>
      <p>Your group is {userGroup}</p>
      <p>Your filtered content is {matching[userRole]}</p>
      <div>
        <p>Collab field:</p>
        <input
          onChange={e =>
            reactiveFn(collabGroup).keySet('collabField', e.target.value)}
          value={reactiveKey ? reactiveKey.collabField : 'fill me'}
        />
      </div>
      <div className="col-md-4">
        <Chat
          messages={reactiveData.list.filter(x => x.groupId === collabGroup)}
          userInfo={userInfo}
          addMessage={reactiveFn(collabGroup).listAdd}
          logger={logger}
        />
      </div>
    </div>
  );
};
