import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

import { Features, FieldToggles, Variables } from '../types/api';
import { Auth } from './auth';
import { TwitterError } from './error';

export class Api extends Auth {
  private static GQL_URL = 'https://twitter.com/i/api/graphql';
  private static V1_API_URL = 'https://api.twitter.com/1.1';
  private static V2_API_URL = 'https://twitter.com/i/api/2';

  protected httpClient: AxiosInstance;

  constructor(cookiePath: string, isBlue: boolean = false) {
    super(cookiePath, isBlue);

    this.httpClient = axios.create({
      headers: {
        Cookie: this.getCookiesAsString(),
        ...this.getGraphqlApiHeaders(),
      },
      withCredentials: true,
    });

    this.httpClient.interceptors.response.use((response) => {
      const setCookieHeaders = response.headers['set-cookie'];
      if (setCookieHeaders) {
        const cookies = setCookieHeaders.map((cookie: string) => {
          const [name, value] = cookie.split(';')[0].split('=');
          return [name, value];
        });
        this.updateCookies(Object.fromEntries(cookies));
        this.httpClient.defaults.headers.Cookie = this.getCookiesAsString();
      }
      return response;
    });
  }

  private getCookiesAsString(): string {
    const cookies = this.getCookies();
    return Object.entries(cookies)
      .map(([key, value]) => `${key}=${value}`)
      .join('; ');
  }

  protected updateHeader(key: string, value: string): void {
    this.httpClient.defaults.headers[key] = value;
  }

  protected removeHeader(key: string): void {
    delete this.httpClient.defaults.headers[key];
  }

  protected async graphqlRun(
    method: 'POST' | 'GET',
    operation: [string, string],
    variables: Variables,
    features?: Features,
    fieldToggles?: FieldToggles,
  ): Promise<AxiosResponse | null> {
    const [queyId, queryName] = operation;

    const execApi = (() => {
      if (method == 'POST') {
        const data: { [key: string]: string | Features | Variables } = {
          variables: variables,
          queryId: queyId,
        };
        if (features) {
          data['features'] = features;
        }
        return this.httpClient.post(
          `${Api.GQL_URL}/${queyId}/${queryName}`,
          data,
        );
      } else if (method == 'GET') {
        return this.httpClient.get(`${Api.GQL_URL}/${queyId}/${queryName}`, {
          params: {
            variables: JSON.stringify(variables),
            features: features ? JSON.stringify(features) : null,
            fieldToggles: fieldToggles ? JSON.stringify(fieldToggles) : null,
          },
        });
      }
    })();

    try {
      const res = await execApi;
      if (!res) {
        throw new TwitterError('No response');
      }

      return res;
    } catch (error) {
      if (error instanceof AxiosError)
        throw new TwitterError(
          `Failed to fetch graphql api`,
          error?.response?.status,
          error,
        );
      if (error instanceof Error)
        throw new TwitterError('Failed to fetch graphql api', undefined, error);
    }

    return null;
  }
}
