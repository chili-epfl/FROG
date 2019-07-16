// @flow

export type VariantT = 'default' | 'success' | 'warning' | 'error' | 'info';

export type ActionT = {
  title: string,
  callback?: () => void
};

export type ShowToastFunctionT = (
  message: string,
  variant?: VariantT,
  actions?: ActionT[]
) => string;
export type HideToastFunctionT = (key?: string) => void;

export type ToastParentPropsT = {
  showToast: ShowToastFunctionT,
  hideToast: HideToastFunctionT
};
