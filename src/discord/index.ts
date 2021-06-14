/*---------------------------------------------------*/
import { CommandClient, ShardClient, SlashCommandClient } from "detritus-client";
/*---------------------------------------------------*/
import YAML from "yaml";
import * as fs from 'fs';
/*---------------------------------------------------*/
const file = fs.readFileSync('./config.yaml', 'utf8')
const config = YAML.parse(file)
/*---------------------------------------------------*/
const shard = new ShardClient(config.botConfig.discordConfig.botToken)

const commandClient = new CommandClient(shard, {
    prefix: config.botConfig.discordConfig.botPrefix,
    useClusterClient: true,
    shardCount: 0
});

const slashClient = new SlashCommandClient(shard);

(async () => {
    // Run everything
    const client = await shard.run();
    
    // Load commands
    await commandClient.addMultipleIn(`${__dirname}/commands`, {isAbsolute: true, subdirectories: true}).catch((...err) => {
        console.log(err);
    });

    console.log("Normal commands loaded!");
    
    // Load slash commands
    await slashClient.addMultipleIn(`${__dirname}/slash_commands`, {isAbsolute: true, subdirectories: true}).catch((...err) => {
        console.log(err);
    });

    console.log("Slash commands loaded!\n");
    
    await commandClient.run();
    await slashClient.run();

    console.log(`Logged on as ${client.user?.toString()}!\nStatistics:\n${commandClient.commands.length} commands,\n${slashClient.commands.size} slash commands,\n${client.shardCount} shards`);
})();