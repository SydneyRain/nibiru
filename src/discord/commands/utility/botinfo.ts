import { CommandClient } from "detritus-client";
import { Permissions } from 'detritus-client/lib/constants';
import { Context } from "detritus-client/lib/command";
import { Embed } from "detritus-client/lib/utils";
import { Package } from "detritus-client/lib/constants";
import { BaseCommand } from '../../structures/BaseCommand';
/*---------------------------------------------------*/
import os from 'os';
/*---------------------------------------------------*/

export const COMMAND_NAME = 'botinfo';

export default class BotInfoCommand extends BaseCommand {
  constructor(client: CommandClient) {
    super(client, {
      name: COMMAND_NAME,
      permissionsClient: [
        Permissions.SEND_MESSAGES,
        Permissions.EMBED_LINKS,
      ],
      onPermissionsFailClient: (context) => context.reply(`Error: Missing Embed permissions!`),
      aliases: [
        'binfo',
      ],
      metadata: {
        description: 'Get information and statistics about the bot.',
        examples: [COMMAND_NAME],
        type: 'utility',
        usage: `${COMMAND_NAME}`,
        botOwner: false,
        nsfw: false
      }
    });
  }

  async run(payload: Context): Promise<any> {
    let uptime = process.uptime() * 1000;
    let memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;
    let cpuUsage = os.loadavg();
    let message = payload.message;

    const embed = new Embed();

    embed.setAuthor(`${payload.client.user?.username}#${payload.client.user?.discriminator}`, `https://cdn.discordapp.com/avatars/${payload.client.user?.id}/${payload.client.user?.avatar}.png`)
      .setDescription(`**${payload.client.user?.username} Statistics**`)
      .setThumbnail(`https://cdn.discordapp.com/avatars/${payload.client.user?.id}/${payload.client.user?.avatar}.png`)
      .setColor(0x32cd32)
      .addField('Commands', `${this.commandClient.commands.length} regular commands`) //TODO: Count slash commands
      .addField('Uptime', `${Math.floor((uptime / (1000 * 60 * 60 * 24)))} days, ${Math.floor((uptime / (1000 * 60 * 60)) % 24)} hours, ${Math.floor((uptime / (1000 * 60)) % 60)} minutes, ${Math.floor((uptime / (1000)) % 60)} seconds`)
      .addField('Serving', `${payload.client.guilds.size} guilds\n${payload.client.members.size} members\n${payload.client.channels.size} channels\n${payload.client.messages.size} messages`, true)
      .addField('Libraries', `Detritus v${Package.VERSION}\nNode ${process.version}\nNibiru v3.0.0`, true)
      .addField(`Creator`, `<@145788286156144641>`, true)
      .setFooter(`Running on ${os.version()}, using ${cpuUsage[0]}% CPU and ${Math.round(memoryUsage * 100) / 100} MB of RAM`)
    message.reply({embed});
  }
}