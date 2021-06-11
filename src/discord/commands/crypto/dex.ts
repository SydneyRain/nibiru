import { CommandClient } from "detritus-client";
import { Permissions } from 'detritus-client/lib/constants';
import { Context } from "detritus-client/lib/command";
import { Embed } from "detritus-client/lib/utils";
import { BaseCommand } from '../../structures/BaseCommand';
/*---------------------------------------------------*/

export interface CommandArgsBefore {
  question: string
}

export interface CommandArgs {
  question: string
}

export const COMMAND_NAME = 'dex';

export default class DexCommand extends BaseCommand {
  constructor(client: CommandClient) {
    super(client, {
      name: COMMAND_NAME,
      permissionsClient: [
        Permissions.SEND_MESSAGES,
        Permissions.EMBED_LINKS,
      ],
      onPermissionsFailClient: (context) => context.reply(`Error: Missing Embed permissions!`),
      aliases: [
        'bnb',
        'bsc',
        'eth',
        'uni',
        'uniswap',
        'cake',
        'pancake',
        'pancakeswap',
      ],
      label: 'question',
      metadata: {
        description: 'View price and information of DeFi tokens. Currently supports Uniswap and Pancakeswap tokens.',
        examples: [COMMAND_NAME],
        type: 'crypto',
        usage: `${COMMAND_NAME} <coin>`,
        botOwner: false,
        nsfw: false
      }
    });
  }

  async run(payload: Context, args: CommandArgs): Promise<any> {
    console.log("Unimplemented");
  }
}