import { Client as DiscordTS } from "@typeit/discord";
import { Intents } from "discord.js";
import Path from "path";

class NibiruClient extends DiscordTS {
    constructor() {
        super({
            intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
            classes: [
                Path.join(__dirname, "../commands", "*.ts"), // Regular commands
                Path.join(__dirname, "../slash_commands", "*.ts"), // Slash commands
                Path.join(__dirname, "../events", "*.ts") // Events
            ],
            silent: false,
            requiredByDefault: true
        });
    }
}

export default NibiruClient;