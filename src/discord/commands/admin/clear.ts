import { CommandClient } from "detritus-client";
import { BaseCommand } from '../../structures/BaseCommand';
import { Context, ParsedArgs } from "detritus-client/lib/command";

export const COMMAND_NAME = 'clear';

export default class ClearCommand extends BaseCommand {
  constructor(client: CommandClient) {
    super(client, {
      name: COMMAND_NAME,
      metadata: {
        description: 'Clear all commands in the bot without having to restart (bot owner only)',
        examples: [COMMAND_NAME],
        type: 'admin',
        usage: `${COMMAND_NAME}`,
        botOwner: true,
        nsfw: false
      }
    });
  }

  async run(payload: Context, __args: ParsedArgs): Promise<any> {
    const message = payload.message;
    this.commandClient.clear();
    this.commandClient.resetCommands();
    await message.reply(`Commands have been cleared and reset.`);
  }
}