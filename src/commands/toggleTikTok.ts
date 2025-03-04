import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
} from "discord.js";
import { config } from "../config.js";

export const data = new SlashCommandBuilder()
  .setName("toggletiktok")
  .setDescription("Toggle TikTok link conversion on or off")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages) // Require manage messages permission
  .addBooleanOption((option) =>
    option
      .setName("enabled")
      .setDescription("Whether to enable or disable TikTok link conversion")
      .setRequired(false)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const enabled = interaction.options.getBoolean("enabled");

  // If enabled is provided, set the value
  if (enabled !== null) {
    config.tiktok.enabled = enabled;
    await interaction.reply({
      content: `TikTok link conversion ${enabled ? "enabled" : "disabled"}`,
      ephemeral: true,
    });
  } else {
    // If enabled is not provided, toggle the current value
    config.tiktok.enabled = !config.tiktok.enabled;
    await interaction.reply({
      content: `TikTok link conversion ${
        config.tiktok.enabled ? "enabled" : "disabled"
      }`,
      ephemeral: true,
    });
  }
}
