/*---------------------------------------------------*/
import { Client as DiscordTS } from "@typeit/discord";
import { Intents } from "discord.js";
/*---------------------------------------------------*/
import * as fs from 'fs';
import * as yaml from "js-yaml";
import Path from "path";
/*---------------------------------------------------*/

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
    
   public async start() {
       const config = yaml.load(fs.readFileSync(__dirname + '/../../../config.yml', 'utf8'));
       await this.login(config.botConfig.discordConfig.token);
       console.log("yay! :)");
   }
}

export default NibiruClient;