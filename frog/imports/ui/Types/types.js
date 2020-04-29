export type SessionObjectT = {
  itemTitle?: string,
  itemIcon: React.ComponentType<*>,
  status: 'Ready' | 'Running' | 'Complete',
  itemType: string,
  dateCreated: string,
  dateObj?: Date,
  callback: () => void,
  secondaryActions: Array<SecondaryActionT>
};
export type DraftObjectT = {
  itemTitle?: string,
  itemIcon: React.ComponentType<*>,
  itemType: string,
  dateCreated: string,
  dateObj?: Date,
  callback: () => void,
  secondaryActions: Array<SecondaryActionT>
};

export type TemplateObjectT = {
  itemTitle?: string,
  itemIcon: React.ComponentType<*>,
  itemType: string,
  dateCreated: string,
  dateObj?: Date,
  callback: () => void,
  secondaryActions: Array<SecondaryActionT>
};

export type SecondaryActionT = {
  title: string,
  icon: React.ComponentType<*>,
  callback?: () => void
};

export type SessionListT = Array<SessionObjectT>;
export type DraftsListT = Array<DraftObjectT>;
export type TemplatesListT = Array<TemplateObjectT>;
