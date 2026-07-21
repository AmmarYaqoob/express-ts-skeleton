export interface IEmail {
  to: Array<string>;
  subject: string;
  text: string;
  isText: boolean;
  firstName: string;
  key: string;
  template: string;
}
