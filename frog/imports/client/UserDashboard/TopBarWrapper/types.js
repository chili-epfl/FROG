export type MenuItemT = {
  name: string,
  icon: React.Component<*>,
  callback: () => void
};
export type TopBarWrapperPropsT = {
  title: string,
  menuItems: Array<MenuItemT>
};
