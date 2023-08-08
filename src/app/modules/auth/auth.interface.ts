export type ILoginUser = {
  id: string;
  password: string;
};
export type ILoginUserResponse = {
  accessToken: string;
  refreshToken?: string;
  needsPasswordChange: boolean | undefined;
};
export type IRefreshTokenResponse = {
  accessToken: string;
};
export type IChangePassword = {
  oldPassword: string;
  newPassword: string;
};
