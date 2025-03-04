/**
 * Bot configuration
 */

export const config = {
  // Twitter/X link conversion settings
  twitter: {
    // Whether to convert Twitter/X links to vxtwitter links
    enabled: true,
    // The reply message to send when a Twitter/X link is detected
    replyMessage: "Here's a better link for viewing that Twitter/X video:",
    // Whether to reply to the user or send a new message
    replyToUser: true,
    // Whether to mention the user in the reply
    mentionUser: false,
    // Whether to delete messages that contain only Twitter/X links
    deleteOnlyLinks: true,
    // The message format when replacing a deleted message
    // Use {username} as placeholder for the user's display name
    // If the format starts with @, it will be converted to a proper mention that pings the user
    deletedMessageFormat: "@{username} enviou:",
  },

  // TikTok link conversion settings
  tiktok: {
    // Whether to convert TikTok links to vxtiktok links
    enabled: true,
    // The reply message to send when a TikTok link is detected
    replyMessage: "Here's a better link for viewing that TikTok video:",
    // Whether to reply to the user or send a new message
    replyToUser: true,
    // Whether to mention the user in the reply
    mentionUser: false,
    // Whether to delete messages that contain only TikTok links
    deleteOnlyLinks: true,
    // The message format when replacing a deleted message
    // Use {username} as placeholder for the user's display name
    // If the format starts with @, it will be converted to a proper mention that pings the user
    deletedMessageFormat: "@{username} enviou:",
  },

  // Instagram link conversion settings
  instagram: {
    // Whether to convert Instagram links to ddinstagram links
    enabled: true,
    // The reply message to send when an Instagram link is detected
    replyMessage: "Here's a better link for viewing that Instagram content:",
    // Whether to reply to the user or send a new message
    replyToUser: true,
    // Whether to mention the user in the reply
    mentionUser: false,
    // Whether to delete messages that contain only Instagram links
    deleteOnlyLinks: true,
    // The message format when replacing a deleted message
    // Use {username} as placeholder for the user's display name
    // If the format starts with @, it will be converted to a proper mention that pings the user
    deletedMessageFormat: "@{username} enviou:",
  },

  // Bot behavior settings
  bot: {
    // Whether to ignore messages from bots
    ignoreBots: true,
    // Whether to ignore messages from the bot itself
    ignoreSelf: true,
  },
};
