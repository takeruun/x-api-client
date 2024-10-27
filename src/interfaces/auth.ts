/* eslint-disable no-unused-vars */

export interface AuthInterface {
  updateCookies(cookies: { [key: string]: string }): void;
  getCookies(): { [key: string]: string };
  getGraphqlApiHeaders(crossOrigin?: boolean): { [key: string]: string };
}
