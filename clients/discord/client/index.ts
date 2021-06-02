/*---------------------------------------------------*/
import { Client as DiscordTS } from "@typeit/discord";
import { Intents } from "discord.js";
/*---------------------------------------------------*/
import * as fs from 'fs';
import * as yaml from "js-yaml";
import Path from "path";
/*---------------------------------------------------*/
const config = yaml.load(fs.readFileSync(__dirname + '/../../../config.yml', 'utf8'));
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
            requiredByDefault: true,
            slashGuilds: ["550144880655990785"] // For debugging. Comment this out or change the server ID.
        });
    }
    
   public async start() {
       await this.login(config.botConfig.discordConfig.token)
        .then(() => {
            // For slash commands
            this.clearSlashes(); 
            this.initSlashes();
            // todo: Add a real logger...
            console.log(`Logged in as ${this.user.tag} (${this.user.id})`)
        });

        // For slash command interactions
        this.on("interaction", (interaction) => {
            this.executeSlash(interaction); 
        });
   }
}

export default NibiruClient;