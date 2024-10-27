export type Operation = {
  HomeTimeline: [string, string];
  HomeLatestTimeline: [string, string];
  CreateDraftTweet: [string, string];
  CreateTweet: [string, string];
  DeleteTweet: [string, string];
  FavoriteTweet: [string, string];
  UnfavoriteTweet: [string, string];
  SearchTimeline: [string, string];
  TweetDetail: [string, string];
};

const Operations: Operation = {
  HomeTimeline: ['HJFjzBgCs16TqxewQOeLNg', 'HomeTimeline'],
  HomeLatestTimeline: ['DiTkXJgLqBBxCs7zaYsbtA', 'HomeLatestTimeline'],
  CreateDraftTweet: ['cH9HZWz_EW9gnswvA4ZRiQ', 'CreateDraftTweet'],
  CreateTweet: ['xT36w0XM3A8jDynpkram2A', 'CreateTweet'],
  DeleteTweet: ['VaenaVgh5q5ih7kvyVjgtg', 'DeleteTweet'],
  FavoriteTweet: ['lI07N6Otwv1PhnEgXILM7A', 'FavoriteTweet'],
  UnfavoriteTweet: ['ZYKSe-w7KEslx3JhSIk5LA', 'UnfavoriteTweet'],
  SearchTimeline: ['UN1i3zUiCWa-6r-Uaho4fw', 'SearchTimeline'],
  TweetDetail: ['QuBlQ6SxNAQCt6-kBiCXCQ', 'TweetDetail'],
};

export { Operations };
