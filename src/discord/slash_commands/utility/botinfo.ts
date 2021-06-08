import { Slash } from 'detritus-client';
import { InteractionCallbackTypes } from 'detritus-client/lib/constants';
import { Embed } from 'detritus-client/lib/utils';
import { Package } from "detritus-client/lib/constants";
import { BaseCommand } from "../../structures/BaseCommandSlash";
/*---------------------------------------------------*/
import os from 'os';
/*---------------------------------------------------*/

export const COMMAND_NAME = 'botinfo';

export default class BotInfoCommand extends BaseCommand {
  description = 'Get information and statistics about the bot.';
  name = COMMAND_NAME;

  async run(context: Slash.SlashContext) {
    let uptime = process.uptime() * 1000;
    let memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;
    let cpuUsage = os.loadavg();

    const embed = new Embed();

    embed.setAuthor(`${context.client.user?.username}#${context.client.user?.discriminator}`, `https://cdn.discordapp.com/avatars/${context.client.user?.id}/${context.client.user?.avatar}.png`)
      .setDescription(`**${context.client.user?.username} Statistics**`)
      .setThumbnail(`https://cdn.discordapp.com/avatars/${context.client.user?.id}/${context.client.user?.avatar}.png`)
      .setColor(0x32cd32)
      .addField('Commands', `${context.slashCommandClient.commands.length} slash commands`) //TODO: Count regular commands
      .addField('Uptime', `${Math.floor((uptime / (1000 * 60 * 60 * 24)))} days, ${Math.floor((uptime / (1000 * 60 * 60)) % 24)} hours, ${Math.floor((uptime / (1000 * 60)) % 60)} minutes, ${Math.floor((uptime / (1000)) % 60)} seconds`)
      .addField('Serving', `${context.client.guilds.size} guilds\n${context.client.members.size} members\n${context.client.channels.size} channels\n${context.client.messages.size} messages`, true)
      .addField('Libraries', `Detritus v${Package.VERSION}\nNode ${process.version}`, true)
      .setFooter(`Running on ${os.version()}, using ${cpuUsage[0]}% CPU and ${Math.round(memoryUsage * 100) / 100} MB of RAM`)
    
    return context.respond(InteractionCallbackTypes.CHANNEL_MESSAGE_WITH_SOURCE, {embed});
  }
};