import {
  REST,
  Routes,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "discord.js";
import { config } from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
config();

// Set up __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
// Grab all the command files from the commands directory
const commandsPath = path.join(__dirname, "commands");

// Create commands directory if it doesn't exist
if (!fs.existsSync(commandsPath)) {
  fs.mkdirSync(commandsPath, { recursive: true });
}

// Grab all command files
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js") || file.endsWith(".ts"));

// Load commands
const loadCommands = async () => {
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import(`file://${filePath}`);

    if ("data" in command && "execute" in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
};

// Deploy commands
const deployCommands = async () => {
  try {
    await loadCommands();

    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The REST module that was defined in discord.js
    const rest = new REST().setToken(process.env.DISCORD_TOKEN || "");

    // Deploy commands
    const data = await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID || "",
        process.env.GUILD_ID || ""
      ),
      { body: commands }
    );

    console.log(
      `Successfully reloaded ${
        Array.isArray(data) ? data.length : 0
      } application (/) commands.`
    );
  } catch (error) {
    console.error(error);
  }
};

deployCommands();
