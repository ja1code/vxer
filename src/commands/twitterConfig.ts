import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
} from "discord.js";
import { config } from "../config.js";

export const data = new SlashCommandBuilder()
  .setName("twitterconfig")
  .setDescription("View or update the Twitter/X link conversion configuration")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages) // Require manage messages permission
  .addSubcommand((subcommand) =>
    subcommand
      .setName("view")
      .setDescription(
        "View the current Twitter/X link conversion configuration"
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("replymessage")
      .setDescription("Set the reply message for Twitter/X link conversion")
      .addStringOption((option) =>
        option
          .setName("message")
          .setDescription(
            "The message to send when a Twitter/X link is detected"
          )
          .setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("replytouser")
      .setDescription("Set whether to reply to the user or send a new message")
      .addBooleanOption((option) =>
        option
          .setName("enabled")
          .setDescription("Whether to reply to the user or send a new message")
          .setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("mentionuser")
      .setDescription("Set whether to mention the user in the reply")
      .addBooleanOption((option) =>
        option
          .setName("enabled")
          .setDescription("Whether to mention the user in the reply")
          .setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("deleteonlylinks")
      .setDescription(
        "Set whether to delete messages that contain only Twitter/X links"
      )
      .addBooleanOption((option) =>
        option
          .setName("enabled")
          .setDescription(
            "Whether to delete messages that contain only Twitter/X links"
          )
          .setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("deletedmessageformat")
      .setDescription("Set the message format when replacing a deleted message")
      .addStringOption((option) =>
        option
          .setName("format")
          .setDescription(
            "The message format (use {username} as placeholder, start with @ to ping)"
          )
          .setRequired(true)
      )
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const subcommand = interaction.options.getSubcommand();

  switch (subcommand) {
    case "view":
      await interaction.reply({
        content:
          `**Current Twitter/X Link Conversion Configuration:**\n\n` +
          `- **Enabled:** ${config.twitter.enabled}\n` +
          `- **Reply Message:** "${config.twitter.replyMessage}"\n` +
          `- **Reply to User:** ${config.twitter.replyToUser}\n` +
          `- **Mention User:** ${config.twitter.mentionUser}\n` +
          `- **Delete Only Links:** ${config.twitter.deleteOnlyLinks}\n` +
          `- **Deleted Message Format:** "${config.twitter.deletedMessageFormat}"`,
        ephemeral: true,
      });
      break;

    case "replymessage":
      const message = interaction.options.get("message")?.value as string;
      config.twitter.replyMessage = message;
      await interaction.reply({
        content: `Reply message updated to: "${message}"`,
        ephemeral: true,
      });
      break;

    case "replytouser":
      const replyToUser = interaction.options.get("enabled")?.value as boolean;
      config.twitter.replyToUser = replyToUser;
      await interaction.reply({
        content: `Reply to user ${replyToUser ? "enabled" : "disabled"}`,
        ephemeral: true,
      });
      break;

    case "mentionuser":
      const mentionUser = interaction.options.get("enabled")?.value as boolean;
      config.twitter.mentionUser = mentionUser;
      await interaction.reply({
        content: `Mention user ${mentionUser ? "enabled" : "disabled"}`,
        ephemeral: true,
      });
      break;

    case "deleteonlylinks":
      const deleteOnlyLinks = interaction.options.get("enabled")
        ?.value as boolean;
      config.twitter.deleteOnlyLinks = deleteOnlyLinks;
      await interaction.reply({
        content: `Delete only links ${
          deleteOnlyLinks ? "enabled" : "disabled"
        }`,
        ephemeral: true,
      });
      break;

    case "deletedmessageformat":
      const format = interaction.options.get("format")?.value as string;
      config.twitter.deletedMessageFormat = format;

      // Determine if the format will ping users
      const willPing = format.startsWith("@");

      await interaction.reply({
        content: `Deleted message format updated to: "${format}"\n\n${
          willPing
            ? "✅ This format will **ping** users when it replaces their messages."
            : "ℹ️ This format will **not ping** users. Add @ at the beginning to enable pinging."
        }`,
        ephemeral: true,
      });
      break;
  }
}
