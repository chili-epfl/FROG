// @flow

const chainUpgrades = (
  upgradeFunctions: { [version: string]: (Object) => Object },
  from: number,
  to: number
) => (x: Object) =>
  from === to
    ? x
    : chainUpgrades(upgradeFunctions, from + 1, to)(
        upgradeFunctions[String(from + 1)](x)
      );

export default chainUpgrades;
