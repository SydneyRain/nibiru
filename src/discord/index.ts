/*---------------------------------------------------*/
import { ClusterClient, CommandClient, SlashCommandClient } from "detritus-client";
/*---------------------------------------------------*/
import YAML from "yaml";
import * as fs from 'fs';
/*---------------------------------------------------*/
const file = fs.readFileSync('./config.yaml', 'utf8')
const config = YAML.parse(file)
/*---------------------------------------------------*/
const cluster = new ClusterClient(config.botConfig.discordConfig.botToken)
/*---------------------------------------------------*/

// Todo: actual logs...

const commandClient = new CommandClient(cluster, {
    prefix: config.botConfig.discordConfig.botPrefix
});

const slashClient = new SlashCommandClient(cluster);

(async () => {
    
    // Run everything
    await cluster.run();
    
    // Load commands
    await commandClient.addMultipleIn(`${__dirname}/commands`, {isAbsolute: true, subdirectories: true}).catch((...err) => {
        console.log(err);
    });

    console.log("Normal commands loaded!");
    
    // Load slash commands
    await slashClient.addMultipleIn(`${__dirname}/slash_commands`, {isAbsolute: true, subdirectories: true}).catch((...err) => {
        console.log(err);
    });

    console.log("Slash commands loaded!");
    
    await commandClient.run();
    await slashClient.run();

    console.log(`Bot logged on! ${slashClient.commands.size} slash commands, ${commandClient.commands.length} commands`);
})();