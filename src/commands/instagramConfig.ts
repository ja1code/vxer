import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
} from "discord.js";
import { config } from "../config.js";

export const data = new SlashCommandBuilder()
  .setName("instagramconfig")
  .setDescription("View or update the Instagram link conversion configuration")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages) // Require manage messages permission
  .addSubcommand((subcommand) =>
    subcommand
      .setName("view")
      .setDescription(
        "View the current Instagram link conversion configuration"
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("replymessage")
      .setDescription("Set the reply message for Instagram link conversion")
      .addStringOption((option) =>
        option
          .setName("message")
          .setDescription(
            "The message to send when an Instagram link is detected"
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
        "Set whether to delete messages that contain only Instagram links"
      )
      .addBooleanOption((option) =>
        option
          .setName("enabled")
          .setDescription(
            "Whether to delete messages that contain only Instagram links"
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
          `**Current Instagram Link Conversion Configuration:**\n\n` +
          `- **Enabled:** ${config.instagram.enabled}\n` +
          `- **Reply Message:** "${config.instagram.replyMessage}"\n` +
          `- **Reply to User:** ${config.instagram.replyToUser}\n` +
          `- **Mention User:** ${config.instagram.mentionUser}\n` +
          `- **Delete Only Links:** ${config.instagram.deleteOnlyLinks}\n` +
          `- **Deleted Message Format:** "${config.instagram.deletedMessageFormat}"`,
        ephemeral: true,
      });
      break;

    case "replymessage":
      const message = interaction.options.get("message")?.value as string;
      config.instagram.replyMessage = message;
      await interaction.reply({
        content: `Reply message updated to: "${message}"`,
        ephemeral: true,
      });
      break;

    case "replytouser":
      const replyToUser = interaction.options.get("enabled")?.value as boolean;
      config.instagram.replyToUser = replyToUser;
      await interaction.reply({
        content: `Reply to user ${replyToUser ? "enabled" : "disabled"}`,
        ephemeral: true,
      });
      break;

    case "mentionuser":
      const mentionUser = interaction.options.get("enabled")?.value as boolean;
      config.instagram.mentionUser = mentionUser;
      await interaction.reply({
        content: `Mention user ${mentionUser ? "enabled" : "disabled"}`,
        ephemeral: true,
      });
      break;

    case "deleteonlylinks":
      const deleteOnlyLinks = interaction.options.get("enabled")
        ?.value as boolean;
      config.instagram.deleteOnlyLinks = deleteOnlyLinks;
      await interaction.reply({
        content: `Delete only links ${
          deleteOnlyLinks ? "enabled" : "disabled"
        }`,
        ephemeral: true,
      });
      break;

    case "deletedmessageformat":
      const format = interaction.options.get("format")?.value as string;
      config.instagram.deletedMessageFormat = format;

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
