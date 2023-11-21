export type IGenericErrorMessage = {
  path: string | number;
  message: string;
};
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface IMongooseServerError extends Error {
  keyValue: string[];
}
