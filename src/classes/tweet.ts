import { AxiosResponse } from 'axios';

import { Operations } from '~/constants';
import { XApiConstructor, XApiInterface } from '~/interfaces';
import { Features, FieldToggles } from '~/types/api';
import {
  CreateTweetVariables,
  DraftTweetResponse,
  DraftTweetVariables,
  FavoriteTweetResponse,
  FavoriteTweetVariables,
  HomeLatestTimelineResponse,
  HomeLatestTimelineVariables,
  HomeTimelineResponse,
  HomeTimelineVariables,
  SearchTimelineResponse,
  SearchTimelineVariables,
  TweetDetailResponse,
  TweetDetailVariables,
  UnfavoriteTweetResponse,
  UnfavoriteTweetVariables,
} from '~/types/tweet';

import { Api } from './api';

export const newXApi = ({
  cookiePath,
  isBlue = false,
}: XApiConstructor): XApiInterface => {
  return new XApi(cookiePath, isBlue);
};

export class XApi extends Api {
  async homeTimeline(
    cursor: string | null = null,
  ): Promise<HomeTimelineResponse> {
    const variables: HomeTimelineVariables = {
      count: 20,
      withCommunity: true,
      latestControlAvailable: true,
      includePromotedContent: true,
      seenTweetIds: [], // 既読ツイートID
    };
    if (cursor) {
      variables['cursor'] = cursor;
    } else {
      variables['requestContext'] = 'launch';
    }
    const features: Features = {
      rweb_tipjar_consumption_enabled: true,
      responsive_web_graphql_exclude_directive_enabled: true,
      verified_phone_label_enabled: false,
      creator_subscriptions_tweet_preview_api_enabled: true,
      responsive_web_graphql_timeline_navigation_enabled: true,
      responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
      communities_web_enable_tweet_community_results_fetch: true,
      c9s_tweet_anatomy_moderator_badge_enabled: true,
      articles_preview_enabled: true,
      responsive_web_edit_tweet_api_enabled: true,
      graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
      view_counts_everywhere_api_enabled: true,
      longform_notetweets_consumption_enabled: true,
      responsive_web_twitter_article_tweet_consumption_enabled: true,
      tweet_awards_web_tipping_enabled: false,
      creator_subscriptions_quote_tweet_preview_enabled: false,
      freedom_of_speech_not_reach_fetch_enabled: true,
      standardized_nudges_misinfo: true,
      tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled:
        true,
      rweb_video_timestamps_enabled: true,
      longform_notetweets_rich_text_read_enabled: true,
      longform_notetweets_inline_media_enabled: true,
      responsive_web_enhance_cards_enabled: false,
    };

    const res = await this.graphqlRun(
      cursor ? 'POST' : 'GET',
      Operations.HomeTimeline,
      variables,
      features,
    );

    if (!res) {
      throw new Error('No response');
    }

    return res.data;
  }

  async homeLatestTimeline(
    count: number = 20,
    cursorId: string | null = null,
  ): Promise<HomeLatestTimelineResponse> {
    const variables: HomeLatestTimelineVariables = {
      includePromotedContent: true,
      latestControlAvailable: true,
      withCommunity: true,
      count: count,
      seenTweetIds: [], // 既読ツイートID
    };
    if (cursorId) {
      variables['cursor'] = cursorId;
    } else {
      variables['requestContext'] = 'launch';
    }

    const features: Features = {
      rweb_tipjar_consumption_enabled: true,
      responsive_web_graphql_exclude_directive_enabled: true,
      verified_phone_label_enabled: false,
      creator_subscriptions_tweet_preview_api_enabled: true,
      responsive_web_graphql_timeline_navigation_enabled: true,
      responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
      communities_web_enable_tweet_community_results_fetch: true,
      c9s_tweet_anatomy_moderator_badge_enabled: true,
      articles_preview_enabled: true,
      tweetypie_unmention_optimization_enabled: true,
      responsive_web_edit_tweet_api_enabled: true,
      graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
      view_counts_everywhere_api_enabled: true,
      longform_notetweets_consumption_enabled: true,
      responsive_web_twitter_article_tweet_consumption_enabled: true,
      tweet_awards_web_tipping_enabled: false,
      creator_subscriptions_quote_tweet_preview_enabled: false,
      freedom_of_speech_not_reach_fetch_enabled: true,
      standardized_nudges_misinfo: true,
      tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled:
        true,
      rweb_video_timestamps_enabled: true,
      longform_notetweets_rich_text_read_enabled: true,
      longform_notetweets_inline_media_enabled: true,
      responsive_web_enhance_cards_enabled: false,
    };

    const res = await this.graphqlRun(
      'POST',
      Operations.HomeLatestTimeline,
      variables,
      features,
    );

    if (!res) {
      throw new Error('No response');
    }

    return res.data;
  }

  async postTweet(text: string): Promise<AxiosResponse> {
    const features: Features = {
      communities_web_enable_tweet_community_results_fetch: true,
      c9s_tweet_anatomy_moderator_badge_enabled: true,
      tweetypie_unmention_optimization_enabled: true,
      responsive_web_edit_tweet_api_enabled: true,
      graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
      view_counts_everywhere_api_enabled: true,
      longform_notetweets_consumption_enabled: true,
      responsive_web_twitter_article_tweet_consumption_enabled: true,
      tweet_awards_web_tipping_enabled: false,
      creator_subscriptions_quote_tweet_preview_enabled: false,
      longform_notetweets_rich_text_read_enabled: true,
      longform_notetweets_inline_media_enabled: true,
      articles_preview_enabled: true,
      rweb_video_timestamps_enabled: true,
      rweb_tipjar_consumption_enabled: true,
      responsive_web_graphql_exclude_directive_enabled: true,
      verified_phone_label_enabled: false,
      freedom_of_speech_not_reach_fetch_enabled: true,
      standardized_nudges_misinfo: true,
      tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled:
        true,
      responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
      responsive_web_graphql_timeline_navigation_enabled: true,
      responsive_web_enhance_cards_enabled: false,
    };

    const variables: CreateTweetVariables = {
      dark_request: false,
      disallowed_reply_options: null,
      media: {
        media_entities: [],
        possibly_sensitive: false,
      },
      semantic_annotation_ids: [],
      tweet_text: text,
    };

    const res = await this.graphqlRun(
      'POST',
      Operations.CreateTweet,
      variables,
      features,
    );

    if (!res) {
      throw new Error('No response');
    }

    return res;
  }

  async draftTweet(text: string): Promise<DraftTweetResponse> {
    const variables: DraftTweetVariables = {
      post_tweet_request: {
        auto_populate_reply_metadata: false,
        exclude_reply_user_ids: [],
        media_ids: [],
        status: text,
      },
    };
    if (this.isBlue) {
      variables['post_tweet_request']['richtext_options'] = [];
    }

    const res = await this.graphqlRun(
      'POST',
      Operations.CreateDraftTweet,
      variables,
    );

    if (!res) {
      throw new Error('No response');
    }

    return res.data;
  }

  async favoriteTweet(tweetId: string): Promise<FavoriteTweetResponse> {
    const variables: FavoriteTweetVariables = {
      tweet_id: tweetId,
    };

    const res = await this.graphqlRun(
      'POST',
      Operations.FavoriteTweet,
      variables,
    );

    if (!res) {
      throw new Error('No response');
    }

    return res.data;
  }

  async unfavoriteTweet(tweetId: string): Promise<UnfavoriteTweetResponse> {
    const variables: UnfavoriteTweetVariables = {
      tweet_id: tweetId,
    };

    const res = await this.graphqlRun(
      'POST',
      Operations.UnfavoriteTweet,
      variables,
    );

    if (!res) {
      throw new Error('No response');
    }

    return res.data;
  }

  async searchTimeline(
    query: string,
    product: SearchTimelineVariables['product'],
    cursor?: string,
  ): Promise<SearchTimelineResponse> {
    const variables: SearchTimelineVariables = {
      rawQuery: query,
      count: 20,
      querySource: 'typed_query',
      product,
      cursor: cursor,
    };
    const features: Features = {
      rweb_tipjar_consumption_enabled: true,
      responsive_web_graphql_exclude_directive_enabled: true,
      verified_phone_label_enabled: false,
      creator_subscriptions_tweet_preview_api_enabled: true,
      responsive_web_graphql_timeline_navigation_enabled: true,
      responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
      communities_web_enable_tweet_community_results_fetch: true,
      c9s_tweet_anatomy_moderator_badge_enabled: true,
      articles_preview_enabled: true,
      tweetypie_unmention_optimization_enabled: true,
      responsive_web_edit_tweet_api_enabled: true,
      graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
      view_counts_everywhere_api_enabled: true,
      longform_notetweets_consumption_enabled: true,
      responsive_web_twitter_article_tweet_consumption_enabled: true,
      tweet_awards_web_tipping_enabled: false,
      creator_subscriptions_quote_tweet_preview_enabled: false,
      freedom_of_speech_not_reach_fetch_enabled: true,
      standardized_nudges_misinfo: true,
      tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled:
        true,
      rweb_video_timestamps_enabled: true,
      longform_notetweets_rich_text_read_enabled: true,
      longform_notetweets_inline_media_enabled: true,
      responsive_web_enhance_cards_enabled: false,
    };

    const referer =
      `https://x.com/search?q=${encodeURIComponent(query)}&src=${variables.querySource}` +
      (variables.product === 'Latest'
        ? '&f=live'
        : variables.product === 'People'
          ? '&f=user'
          : variables.product === 'Media'
            ? '&f=media'
            : variables.product === 'Lists'
              ? '&f=list'
              : '');

    this.updateHeader('referer', referer);
    const res = await this.graphqlRun(
      'GET',
      Operations.SearchTimeline,
      variables,
      features,
    );
    this.removeHeader('referer');

    if (!res) {
      throw new Error('No response');
    }

    return res.data;
  }

  async tweetDetail(
    userName: string,
    tweetId: string,
    cursor?: string,
  ): Promise<TweetDetailResponse> {
    const variables: TweetDetailVariables = {
      focalTweetId: tweetId,
      referrer: 'tweet',
      cursor,
      with_rux_injections: false,
      rankingMode: 'Relevance',
      includePromotedContent: true,
      withCommunity: true,
      withQuickPromoteEligibilityTweetFields: true,
      withBirdwatchNotes: true,
      withVoice: true,
    };
    const features: Features = {
      rweb_tipjar_consumption_enabled: true,
      responsive_web_graphql_exclude_directive_enabled: true,
      verified_phone_label_enabled: false,
      creator_subscriptions_tweet_preview_api_enabled: true,
      responsive_web_graphql_timeline_navigation_enabled: true,
      responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
      communities_web_enable_tweet_community_results_fetch: true,
      c9s_tweet_anatomy_moderator_badge_enabled: true,
      articles_preview_enabled: true,
      tweetypie_unmention_optimization_enabled: true,
      responsive_web_edit_tweet_api_enabled: true,
      graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
      view_counts_everywhere_api_enabled: true,
      longform_notetweets_consumption_enabled: true,
      responsive_web_twitter_article_tweet_consumption_enabled: true,
      tweet_awards_web_tipping_enabled: false,
      creator_subscriptions_quote_tweet_preview_enabled: false,
      freedom_of_speech_not_reach_fetch_enabled: true,
      standardized_nudges_misinfo: true,
      tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled:
        true,
      rweb_video_timestamps_enabled: true,
      longform_notetweets_rich_text_read_enabled: true,
      longform_notetweets_inline_media_enabled: true,
      responsive_web_enhance_cards_enabled: false,
    };
    const fieldToggles: FieldToggles = {
      withArticleRichContentState: true,
      withArticlePlainText: false,
      withGrokAnalyze: false,
      withDisallowedReplyControls: false,
    };

    const referer = `https://x.com/${userName}/status/${tweetId}`;
    this.updateHeader('referer', referer);
    const res = await this.graphqlRun(
      'GET',
      Operations.TweetDetail,
      variables,
      features,
      fieldToggles,
    );
    this.removeHeader('referer');

    if (!res) {
      throw new Error('No response');
    }

    return res.data;
  }
}
