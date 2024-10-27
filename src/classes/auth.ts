import * as fs from 'fs';

import { AuthInterface } from '~/interfaces/auth';

/**
 * Auth class
 * Twitter API 利用するための、header,cookieを設定する
 */
export class Auth implements AuthInterface {
  // User-Agent and Sec-CH-UA are spoofed to Chrome 125
  private static USER_AGENT =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';
  private static SEC_CH_UA =
    '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"';

  private static SEC_CH_UA_PLATFORM = '"macOS"';

  // GraphQL API Bearer Token
  private static TWITTER_GRAPHQL_BEARER_TOKEN =
    'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA';

  private htmlHeaders: { [key: string]: string };
  private jsHeaders: { [key: string]: string };
  private authApiHeaders: { [key: string]: string | null };
  private graphqlApiHeaders: { [key: string]: string | null };
  private cookies: { [key: string]: string };

  public isBlue: true | false;

  constructor(cookiePath: string, isBlue: boolean = false) {
    if (cookiePath === '') {
      throw new Error('Cookie path is empty');
    }
    this.isBlue = isBlue || false;

    this.htmlHeaders = {
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'accept-encoding': 'gzip, deflate, br, zstd',
      'accept-language': 'ja;q=0.9',
      'sec-ch-ua': Auth.SEC_CH_UA,
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': Auth.SEC_CH_UA_PLATFORM,
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1',
      'user-agent': Auth.USER_AGENT,
    };

    // HTTP request headers for fetching JavaScript
    this.jsHeaders = { ...this.htmlHeaders };
    this.jsHeaders['accept'] = '*/*';
    this.jsHeaders['origin'] = 'https://x.com';
    this.jsHeaders['referer'] = 'https://x.com/';
    this.jsHeaders['sec-fetch-dest'] = 'script';
    this.jsHeaders['sec-fetch-mode'] = 'no-cors';
    this.jsHeaders['sec-fetch-site'] = 'cross-site';
    delete this.jsHeaders['sec-fetch-user'];

    // HTTP request headers for authentication flow API access
    this.authApiHeaders = {
      accept: '*/*',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'ja',
      authorization: Auth.TWITTER_GRAPHQL_BEARER_TOKEN,
      'content-type': 'application/json',
      origin: 'https://x.com',
      referer: 'https://x.com/',
      'sec-ch-ua': Auth.SEC_CH_UA,
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': Auth.SEC_CH_UA_PLATFORM,
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'user-agent': Auth.USER_AGENT,
      'x-csrf-token': null, // Will be set later
      'x-guest-token': null, // Will be set later
      'x-twitter-active-user': 'yes',
      'x-twitter-client-language': 'ja',
    };

    // HTTP request headers for GraphQL API (Twitter Web App API) access
    this.graphqlApiHeaders = {
      accept: '*/*',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'ja',
      authorization: Auth.TWITTER_GRAPHQL_BEARER_TOKEN,
      'content-type': 'application/json',
      'sec-ch-ua': Auth.SEC_CH_UA,
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': Auth.SEC_CH_UA_PLATFORM,
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'user-agent': Auth.USER_AGENT,
      'x-csrf-token': null, // Will be set later
      'x-twitter-active-user': 'yes',
      'x-twitter-auth-type': 'OAuth2Session',
      'x-twitter-client-language': 'ja',
    };

    // クッキーをファイルから読み込み
    this.cookies = this.loadCookiesFromFle(cookiePath);

    if (!this.cookies['auth_token'] || !this.cookies['ct0']) {
      throw new Error('Failed to get auth_token or ct0 from Cookie');
    }

    if (this.cookies['gt']) {
      this.authApiHeaders['x-guest-token'] = this.cookies['gt'];
    }

    if (this.cookies['ct0']) {
      this.authApiHeaders['x-csrf-token'] = this.cookies['ct0'];
      this.graphqlApiHeaders['x-csrf-token'] = this.cookies['ct0'];
    }
  }

  updateCookies(cookies: { [key: string]: string }): void {
    for (const key in cookies) {
      this.cookies[key] = cookies[key];
    }
    this.updateCsrfToken();
  }

  getCookies(): { [key: string]: string } {
    return this.cookies;
  }

  /**
   * get headers for graphql api
   */
  // Twitter API v1.1 は crossOrigin=true (api.x.com が x.com から見て cross-origin になる)
  // GraphQL API は crossOrigin=false (GraphQL API は x.com から見て same-origin になる)
  getGraphqlApiHeaders(crossOrigin: boolean = false): {
    [key: string]: string;
  } {
    const headers = this.graphqlApiHeaders;

    if (headers['x-csrf-token'] === null) {
      throw new Error('x-csrf-token is null');
    }

    if (crossOrigin) {
      headers['origin'] = 'https://x.com';
      headers['referer'] = 'https://x.com/';
    }

    return headers as { [key: string]: string };
  }

  private loadCookiesFromFle(cookiePath: string): { [key: string]: string } {
    const cookies: { [key: string]: string } = {};
    if (fs.existsSync(cookiePath)) {
      const cookieData = fs.readFileSync(cookiePath, 'utf8');
      // json parse
      const cookieJson = JSON.parse(cookieData);
      new Map<string, string>(Object.entries(cookieJson)).forEach(
        (value, key) => {
          cookies[key] = value;
        },
      );
    }
    return cookies;
  }

  /**
   * update csrf token
   */
  // 必ずヘッダー x-csrf-token の値と Cookie 内の "ct0" と常に一致させなければならない
  private updateCsrfToken() {
    if (this.cookies['ct0']) {
      this.authApiHeaders['x-csrf-token'] = this.cookies['ct0'];
      this.graphqlApiHeaders['x-csrf-token'] = this.cookies['ct0'];
    }
  }
}
