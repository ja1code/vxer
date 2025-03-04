import { Client, GatewayIntentBits, Events, Collection } from "discord.js";
import { config } from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  convertTwitterLinks,
  convertTikTokLinks,
  convertInstagramLinks,
} from "./utils/linkParser.js";
import { config as botConfig } from "./config.js";

// Load environment variables
config();

// Set up __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Extend the Client interface to include commands
declare module "discord.js" {
  interface Client {
    commands: Collection<string, any>;
  }
}

// Initialize the commands collection
client.commands = new Collection();

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Load command files
const loadCommands = async () => {
  const commandsPath = path.join(__dirname, "commands");

  try {
    // Create commands directory if it doesn't exist
    if (!fs.existsSync(commandsPath)) {
      fs.mkdirSync(commandsPath, { recursive: true });
    }

    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js") || file.endsWith(".ts"));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = await import(`file://${filePath}`);

      // Set a new item in the Collection with the key as the command name and the value as the exported module
      if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    }
  } catch (error) {
    console.error("Error loading commands:", error);
  }
};

// Handle interactions (slash commands)
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

// Helper function to handle message replacement for links
async function handleMessageReplacement(
  message: any,
  content: string,
  config: {
    deleteOnlyLinks: boolean;
    deletedMessageFormat: string;
  },
  containsOnlyLink: boolean
): Promise<boolean> {
  // If the message contains only a link and deleteOnlyLinks is enabled
  if (containsOnlyLink && config.deleteOnlyLinks) {
    // Check if the bot has permission to delete messages
    const hasPermission =
      message.guild && message.channel.isTextBased() && message.deletable;

    if (hasPermission) {
      // Get the user who sent the message
      const user = message.author;

      // Format the message with the username
      // Replace {username} with the display name (not the mention)
      const displayName = message.member?.displayName || user.username;
      let formattedMessage = config.deletedMessageFormat.replace(
        "{username}",
        displayName
      );

      // If the format starts with @ and doesn't already include a mention, add a proper mention
      if (
        formattedMessage.startsWith("@") &&
        !formattedMessage.includes(`<@${user.id}>`)
      ) {
        // Replace the @username with a proper mention
        formattedMessage = formattedMessage.replace(
          `@${displayName}`,
          `<@${user.id}>`
        );
      }

      // Delete the original message
      await message.delete();

      // Send a new message with the user's mention and the converted link
      await message.channel.send({
        content: `${formattedMessage}\n${content}`,
        allowedMentions: {
          users: [user.id], // Ensure the user gets pinged
        },
      });
      return true;
    }
  }
  return false;
}

// Handle message events for link conversion
client.on(Events.MessageCreate, async (message) => {
  // Ignore messages from bots (including itself) if configured to do so
  if (botConfig.bot.ignoreBots && message.author.bot) return;

  // Ignore messages from self if configured to do so
  if (botConfig.bot.ignoreSelf && message.author.id === client.user?.id) return;

  // Process Twitter links if enabled
  if (botConfig.twitter.enabled) {
    // Check if the message contains Twitter/X links
    const {
      modified: twitterModified,
      content: twitterContent,
      containsOnlyTwitterLink,
    } = convertTwitterLinks(message.content);

    // If the message was modified (contains Twitter/X links)
    if (twitterModified) {
      try {
        // Try to handle message replacement
        const handled = await handleMessageReplacement(
          message,
          twitterContent,
          botConfig.twitter,
          containsOnlyTwitterLink
        );

        // If not handled as a replacement, send a reply or new message
        if (!handled) {
          if (botConfig.twitter.replyToUser) {
            await message.reply({
              content: `${botConfig.twitter.replyMessage}\n${twitterContent}`,
              allowedMentions: {
                repliedUser: botConfig.twitter.mentionUser,
              },
            });
          } else {
            await message.channel.send({
              content: `${botConfig.twitter.replyMessage}\n${twitterContent}`,
            });
          }
        }

        // Skip further processing if we already processed Twitter links
        return;
      } catch (error) {
        console.error("Error handling Twitter/X link:", error);
      }
    }
  }

  // Process TikTok links if enabled
  if (botConfig.tiktok.enabled) {
    // Check if the message contains TikTok links
    const {
      modified: tiktokModified,
      content: tiktokContent,
      containsOnlyTikTokLink,
    } = convertTikTokLinks(message.content);

    // If the message was modified (contains TikTok links)
    if (tiktokModified) {
      try {
        // Try to handle message replacement
        const handled = await handleMessageReplacement(
          message,
          tiktokContent,
          botConfig.tiktok,
          containsOnlyTikTokLink
        );

        // If not handled as a replacement, send a reply or new message
        if (!handled) {
          if (botConfig.tiktok.replyToUser) {
            await message.reply({
              content: `${botConfig.tiktok.replyMessage}\n${tiktokContent}`,
              allowedMentions: {
                repliedUser: botConfig.tiktok.mentionUser,
              },
            });
          } else {
            await message.channel.send({
              content: `${botConfig.tiktok.replyMessage}\n${tiktokContent}`,
            });
          }
        }

        // Skip further processing if we already processed TikTok links
        return;
      } catch (error) {
        console.error("Error handling TikTok link:", error);
      }
    }
  }

  // Process Instagram links if enabled
  if (botConfig.instagram.enabled) {
    // Check if the message contains Instagram links
    const {
      modified: instagramModified,
      content: instagramContent,
      containsOnlyInstagramLink,
    } = convertInstagramLinks(message.content);

    // If the message was modified (contains Instagram links)
    if (instagramModified) {
      try {
        // Try to handle message replacement
        const handled = await handleMessageReplacement(
          message,
          instagramContent,
          botConfig.instagram,
          containsOnlyInstagramLink
        );

        // If not handled as a replacement, send a reply or new message
        if (!handled) {
          if (botConfig.instagram.replyToUser) {
            await message.reply({
              content: `${botConfig.instagram.replyMessage}\n${instagramContent}`,
              allowedMentions: {
                repliedUser: botConfig.instagram.mentionUser,
              },
            });
          } else {
            await message.channel.send({
              content: `${botConfig.instagram.replyMessage}\n${instagramContent}`,
            });
          }
        }
      } catch (error) {
        console.error("Error handling Instagram link:", error);
      }
    }
  }
});

// Load commands and log in to Discord
const main = async () => {
  try {
    await loadCommands();
    // Login to Discord with your client's token
    await client.login(process.env.DISCORD_TOKEN);
  } catch (error) {
    console.error("Failed to start the bot:", error);
  }
};

main();
