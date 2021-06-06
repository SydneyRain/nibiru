/*---------------------------------------------------*/
import { GuardFunction } from "@typeit/discord";
import { CommandInteraction } from "discord.js";
/*---------------------------------------------------*/
import * as fs from 'fs';
import * as yaml from "js-yaml";
/*---------------------------------------------------*/
const config = yaml.load(fs.readFileSync(__dirname + '/../../../config.yml', 'utf8'));
/*---------------------------------------------------*/

export const IsBotOwner: GuardFunction<CommandInteraction> = async (
  interaction,
  client,
  next
) => {
    if(interaction.user.id !== config.botConfig.discordConfig.botOwner) {
        return interaction.reply('You are not allowed to use this command.');
    }
    else {
        await next();
    }
};