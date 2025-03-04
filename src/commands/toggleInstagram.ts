import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
} from "discord.js";
import { config } from "../config.js";

export const data = new SlashCommandBuilder()
  .setName("toggleinstagram")
  .setDescription("Toggle Instagram link conversion on or off")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages) // Require manage messages permission
  .addBooleanOption((option) =>
    option
      .setName("enabled")
      .setDescription("Whether to enable or disable Instagram link conversion")
      .setRequired(false)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const enabled = interaction.options.getBoolean("enabled");

  // If enabled is provided, set the value
  if (enabled !== null) {
    config.instagram.enabled = enabled;
    await interaction.reply({
      content: `Instagram link conversion ${enabled ? "enabled" : "disabled"}`,
      ephemeral: true,
    });
  } else {
    // If enabled is not provided, toggle the current value
    config.instagram.enabled = !config.instagram.enabled;
    await interaction.reply({
      content: `Instagram link conversion ${
        config.instagram.enabled ? "enabled" : "disabled"
      }`,
      ephemeral: true,
    });
  }
}
