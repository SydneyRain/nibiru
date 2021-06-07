/* Todo:
Validate URL/IP address.
*/
import { CommandClient } from "detritus-client";
import { BaseCommand } from '../../structures/BaseCommand';
import { Context } from "detritus-client/lib/command";
/*---------------------------------------------------*/
import * as Ping from "ping";
/*---------------------------------------------------*/

export const COMMAND_NAME = 'ping';

export interface CommandArgsBefore {
  website: string
}

export interface CommandArgs {
  website: string
}

export default class PingCommand extends BaseCommand {
  constructor(client: CommandClient) {
    super(client, {
      name: COMMAND_NAME,
      label: 'website',
      metadata: {
        description: 'Ping the bot and get Discord\'s Gateway ping. Can also ping a website/IP address.',
        examples: [
          `${COMMAND_NAME}`,
          `${COMMAND_NAME} google.com`,
          `${COMMAND_NAME} 127.0.0.1`],
        type: 'utility',
        usage: `${COMMAND_NAME}`,
        botOwner: false,
        nsfw: false
      }
    });
  }

  async run(payload: Context, args: CommandArgs): Promise<any> {
    const message = payload.message;

    if(!args.website) { 
      const { gateway, rest } = await payload.client.ping(); 
      return message.reply(`🏓 Pong! (Gateway: ${gateway}ms, Rest: ${rest}ms)`);
    }

    Ping.promise.probe(args.website).then(function (res) {
      return message.reply(`\`\`\`${res.output || "An unknown error has occurred"}\`\`\``)
    });
  }
}