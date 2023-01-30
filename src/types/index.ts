export type InputChangeEventHandler = React.ChangeEvent<HTMLInputElement>;
export type TextareaChangeEventHandler =
  React.ChangeEventHandler<HTMLTextAreaElement>;
export type SelectChangeEventHandler =
  React.ChangeEventHandler<HTMLSelectElement>;

export interface ISignForm {
  login: string;
  password: string;
}
export interface IAccount {
  token: string | null;
  notifcs: number;
}
export enum AdminActionType {
  EDIT = "edit",
  ADD = "add",
}
export interface IFillial {
  id: number;
  name_en: string;
}
