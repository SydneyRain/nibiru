import { Slash } from 'detritus-client';
import { ApplicationCommandOptionTypes, InteractionCallbackTypes } from 'detritus-client/lib/constants';
import { BaseCommand } from "../../structures/BaseCommandSlash";
/*---------------------------------------------------*/
import * as Ping from "ping";
/*---------------------------------------------------*/

export const COMMAND_NAME = 'ping';

export interface CommandArgs {
  website: string
}

export default class PingCommand extends BaseCommand {
  description = 'Ping the bot and get Discord\'s Gateway ping. Can also ping a website/IP address!';
  name = COMMAND_NAME;

  constructor() {
    super({
      options: [
        {name: 'website', type: ApplicationCommandOptionTypes.STRING, description: 'Website/IP to ping.', required: false}
      ],
    })
  }

  async run(context: Slash.SlashContext, args: CommandArgs) {
    if (!args.website) {
      const { gateway, rest } = await context.client.ping(); 
      return context.respond(InteractionCallbackTypes.CHANNEL_MESSAGE_WITH_SOURCE, `🏓 Pong! (Gateway: ${gateway}ms, Rest: ${rest}ms)`);
    }

    Ping.promise.probe(args.website).then(function (res) {
      return context.respond(InteractionCallbackTypes.CHANNEL_MESSAGE_WITH_SOURCE, `\`\`\`${res.output || "An unknown error has occurred"}\`\`\``);
    });
  }
};