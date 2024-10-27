/* eslint-disable no-unused-vars */

import { AxiosResponse } from 'axios';

import {
  DraftTweetResponse,
  FavoriteTweetResponse,
  HomeLatestTimelineResponse,
  HomeTimelineResponse,
  SearchTimelineResponse,
  SearchTimelineVariables,
  TweetDetailResponse,
  UnfavoriteTweetResponse,
} from '~/types/tweet';

export interface XApiConstructor {
  cookiePath: string;
  isBlue?: boolean;
}

export interface XApiInterface {
  homeTimeline(cursor?: string | null): Promise<HomeTimelineResponse>;
  homeLatestTimeline(
    count?: number,
    cursorId?: string | null,
  ): Promise<HomeLatestTimelineResponse>;
  postTweet(text: string): Promise<AxiosResponse>;
  draftTweet(text: string): Promise<DraftTweetResponse>;
  favoriteTweet(tweetId: string): Promise<FavoriteTweetResponse>;
  unfavoriteTweet(tweetId: string): Promise<UnfavoriteTweetResponse>;
  searchTimeline(
    query: string,
    product: SearchTimelineVariables['product'],
    cursor?: string,
  ): Promise<SearchTimelineResponse>;
  tweetDetail(userName: string, tweetId: string): Promise<TweetDetailResponse>;
}
