import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
} from "discord.js";
import { config } from "../config.js";

export const data = new SlashCommandBuilder()
  .setName("toggletwitter")
  .setDescription("Toggle the Twitter/X link conversion feature")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages) // Require manage messages permission
  .addBooleanOption((option) =>
    option
      .setName("enabled")
      .setDescription(
        "Whether to enable or disable the Twitter/X link conversion feature"
      )
      .setRequired(false)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  // Get the current state if no option is provided
  const enabledOption = interaction.options.get("enabled");

  if (enabledOption) {
    // Set the state based on the provided option
    const enabled = enabledOption.value as boolean;
    config.twitter.enabled = enabled;

    await interaction.reply({
      content: `Twitter/X link conversion has been ${
        enabled ? "enabled" : "disabled"
      }.`,
      ephemeral: true,
    });
  } else {
    // Toggle the current state
    config.twitter.enabled = !config.twitter.enabled;

    await interaction.reply({
      content: `Twitter/X link conversion has been ${
        config.twitter.enabled ? "enabled" : "disabled"
      }.`,
      ephemeral: true,
    });
  }
}
