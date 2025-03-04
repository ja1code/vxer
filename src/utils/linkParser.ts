/**
 * Utility functions for parsing and converting links
 */

/**
 * Result of converting Twitter/X links
 */
export interface TwitterLinkConversionResult {
  modified: boolean;
  content: string;
  containsOnlyTwitterLink: boolean;
  originalLink?: string;
}

/**
 * Result of converting TikTok links
 */
export interface TikTokLinkConversionResult {
  modified: boolean;
  content: string;
  containsOnlyTikTokLink: boolean;
  originalLink?: string;
}

/**
 * Result of converting Instagram links
 */
export interface InstagramLinkConversionResult {
  modified: boolean;
  content: string;
  containsOnlyInstagramLink: boolean;
  originalLink?: string;
}

/**
 * Converts Twitter/X links to vxtwitter links
 * @param content The message content to parse
 * @returns The content with Twitter/X links converted to vxtwitter links
 */
export function convertTwitterLinks(
  content: string
): TwitterLinkConversionResult {
  // Regular expression to match Twitter/X links
  // This matches both twitter.com and x.com links
  const twitterRegex =
    /https?:\/\/((?:www\.)?(?:twitter\.com|x\.com))\/([a-zA-Z0-9_]+)\/status\/([0-9]+)(?:\S*)/g;

  // Check if the content contains any Twitter/X links
  const hasTwitterLinks = twitterRegex.test(content);

  // If no Twitter/X links are found, return the original content
  if (!hasTwitterLinks) {
    return {
      modified: false,
      content,
      containsOnlyTwitterLink: false,
    };
  }

  // Reset the regex lastIndex to start from the beginning again
  twitterRegex.lastIndex = 0;

  // Check if the message contains only a Twitter/X link
  // First, get all matches
  const matches = [...content.matchAll(twitterRegex)];
  const originalLink = matches.length > 0 ? matches[0][0] : undefined;

  // Trim the content and check if it matches the first link exactly
  const trimmedContent = content.trim();
  const containsOnlyTwitterLink =
    matches.length === 1 && trimmedContent === originalLink;

  // Replace all Twitter/X links with vxtwitter links
  const modifiedContent = content.replace(
    twitterRegex,
    "https://vxtwitter.com/$2/status/$3"
  );

  return {
    modified: true,
    content: modifiedContent,
    containsOnlyTwitterLink,
    originalLink,
  };
}

/**
 * Converts TikTok links to vxtiktok links
 * @param content The message content to parse
 * @returns The content with TikTok links converted to vxtiktok links
 */
export function convertTikTokLinks(
  content: string
): TikTokLinkConversionResult {
  // Regular expression to match TikTok links
  // This matches tiktok.com links including /t/ short links
  const tiktokRegex =
    /https?:\/\/((?:www\.)?(?:tiktok\.com))\/(@[a-zA-Z0-9_.]+\/video\/[0-9]+|t\/[a-zA-Z0-9_]+)(?:\S*)/g;

  // Check if the content contains any TikTok links
  const hasTikTokLinks = tiktokRegex.test(content);

  // If no TikTok links are found, return the original content
  if (!hasTikTokLinks) {
    return {
      modified: false,
      content,
      containsOnlyTikTokLink: false,
    };
  }

  // Reset the regex lastIndex to start from the beginning again
  tiktokRegex.lastIndex = 0;

  // Check if the message contains only a TikTok link
  // First, get all matches
  const matches = [...content.matchAll(tiktokRegex)];
  const originalLink = matches.length > 0 ? matches[0][0] : undefined;

  // Trim the content and check if it matches the first link exactly
  const trimmedContent = content.trim();
  const containsOnlyTikTokLink =
    matches.length === 1 && trimmedContent === originalLink;

  // Replace all TikTok links with vxtiktok links
  const modifiedContent = content.replace(
    tiktokRegex,
    "https://vxtiktok.com/$2"
  );

  return {
    modified: true,
    content: modifiedContent,
    containsOnlyTikTokLink,
    originalLink,
  };
}

/**
 * Converts Instagram links to ddinstagram links
 * @param content The message content to parse
 * @returns The content with Instagram links converted to ddinstagram links
 */
export function convertInstagramLinks(
  content: string
): InstagramLinkConversionResult {
  // Regular expression to match Instagram links
  // This matches instagram.com links for posts, reels, and stories
  const instagramRegex =
    /https?:\/\/((?:www\.)?(?:instagram\.com))\/(?:p|reel|stories)\/([a-zA-Z0-9_-]+)(?:\S*)/g;

  // Check if the content contains any Instagram links
  const hasInstagramLinks = instagramRegex.test(content);

  // If no Instagram links are found, return the original content
  if (!hasInstagramLinks) {
    return {
      modified: false,
      content,
      containsOnlyInstagramLink: false,
    };
  }

  // Reset the regex lastIndex to start from the beginning again
  instagramRegex.lastIndex = 0;

  // Check if the message contains only an Instagram link
  // First, get all matches
  const matches = [...content.matchAll(instagramRegex)];
  const originalLink = matches.length > 0 ? matches[0][0] : undefined;

  // Trim the content and check if it matches the first link exactly
  const trimmedContent = content.trim();
  const containsOnlyInstagramLink =
    matches.length === 1 && trimmedContent === originalLink;

  // Replace all Instagram links with ddinstagram links
  const modifiedContent = content.replace(instagramRegex, (match) => {
    // Replace instagram.com with ddinstagram.com
    return match.replace("instagram.com", "ddinstagram.com");
  });

  return {
    modified: true,
    content: modifiedContent,
    containsOnlyInstagramLink,
    originalLink,
  };
}
