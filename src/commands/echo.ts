import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("echo")
  .setDescription("Echoes your input")
  .addStringOption((option) =>
    option
      .setName("input")
      .setDescription("The input to echo back")
      .setRequired(true)
  )
  .addBooleanOption((option) =>
    option
      .setName("ephemeral")
      .setDescription(
        "Whether or not the echo should be ephemeral (only visible to you)"
      )
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const input = interaction.options.getString("input", true);
  const ephemeral = interaction.options.getBoolean("ephemeral") || false;

  await interaction.reply({
    content: input,
    ephemeral: ephemeral,
  });
}
