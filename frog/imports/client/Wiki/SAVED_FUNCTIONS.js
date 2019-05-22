getInstanceId = page => {
  const urlInstance = this.props.match.params.instance || false;
  if (!page || page.liId) {
    return 'all';
  }
  if (urlInstance) {
    if (page.plane === 2) {
      return urlInstance.trim();
    }
    return findKey(page.instances, x => x.username === urlInstance.trim());
  }
  const userId = Meteor.userId();
  if (page.plane === 1) {
    return page.instances[userId]
      ? userId
      : page.noNewInstances
      ? undefined
      : userId;
  }

  if (page.plane === 2) {
    const group = findKey(page.socialStructure, x => x.includes(userId));
    return group || (page.noNewInstances ? 'Group activity' : 'Other group');
  }
  return 'all';
};

getInstanceName = page => {
  if (!page || page.plane === 3 || page.liId) {
    return '';
  }
  const instanceId = this.getInstanceId(page);
  if (page.plane === 2) {
    return instanceId;
  }
  return (
    page.instances[instanceId]?.username ||
    (page.noNewInstances ? 'Individual activity' : '')
  );
};

createActivityPage = (newTitle, rawconfig) => {
  const { activityType, config, invalid } = rawconfig;
  const id = uuid();
  const doc = connection.get('rz', id + '/all');
  doc.create(activityTypesObj[activityType].dataStructure);
  const payload = {
    acType: activityType,
    activityData: { config },
    rz: id + '/all',
    title: newTitle,
    activityTypeTitle: activityTypesObj[activityType].meta.name
  };

  const newId = dataFn.createLearningItem(
    'li-activity',
    payload,
    {
      title: newTitle
    },
    true
  );

  addNewWikiPage(this.wikiDoc, newTitle, true, 'li-activity', 3, {
    all: { liId: newId }
  });
  this.setState({
    mode: 'document'
  });
};
