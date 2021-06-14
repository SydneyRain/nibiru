import { CommandClient } from "detritus-client";
import { Permissions } from 'detritus-client/lib/constants';
import { Context } from "detritus-client/lib/command";
import { Embed } from 'detritus-client/lib/utils';
import { BaseCommand } from '../../structures/BaseCommand';
/*---------------------------------------------------*/
import * as fs from 'fs';
/*---------------------------------------------------*/

export interface CommandArgsBefore {
  cryptotoLookup: string
}

export interface CommandArgs {
  cryptotoLookup: string
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
      label: 'cryptotoLookup',
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
    const message = payload.message;

    let embed = new Embed();

    embed.setTitle(`test`)
      .setDescription(`[Click here to view chart](https://charts.bogged.finance/?token=)`)
      .setColor(0xfe3813)
      .setThumbnail(`attachment://logo.png`)
      .addField('Current Price', `USD$ (%)`, true)
      .addField('Market Cap', `USD$`, true)
      .addField('Volume', `USD$`, true)
      .addField('Liquidity', `USD$`, true)
  
      .setFooter(`Last updated at 2021-06-11 20:31 UTC`)
    message.reply({embed, file: {
      filename: 'logo.png',
      value: fs.readFileSync(`./img/crypto_icons/bnb-binance-coin.png`)
    }});
  }
}