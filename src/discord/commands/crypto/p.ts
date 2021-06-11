import { CommandClient } from "detritus-client";
import { Permissions } from 'detritus-client/lib/constants';
import { Context } from "detritus-client/lib/command";
import { Embed } from "detritus-client/lib/utils";
import { BaseCommand } from '../../structures/BaseCommand';
/*---------------------------------------------------*/
import * as fs from 'fs';
/*---------------------------------------------------*/

export interface CommandArgsBefore {
  cryptoToLookup: string
}

export interface CommandArgs {
    cryptoToLookup: string
}

export const COMMAND_NAME = 'p';

export default class PriceCommand extends BaseCommand {
  constructor(client: CommandClient) {
    super(client, {
      name: COMMAND_NAME,
      permissionsClient: [
        Permissions.SEND_MESSAGES,
        Permissions.EMBED_LINKS,
      ],
      onPermissionsFailClient: (context) => context.reply(`Error: Missing Embed permissions!`),
      aliases: [
        'price'
      ],
      label: 'cryptoToLookup',
      metadata: {
        description: 'Look up a cryptocurrency\'s current price. Currently supports over 3000 different coins.',
        examples: [`${COMMAND_NAME} BTC`,
        `${COMMAND_NAME} Dogecoin`,
        `${COMMAND_NAME} litecoin`
        ],
        type: 'crypto',
        usage: `${COMMAND_NAME}`,
        botOwner: false,
        nsfw: false
      }
    });
  }

  async run(payload: Context, args: CommandArgs): Promise<any> {
      const message = payload.message;

      let ticker = fs.readFileSync('./_cache/tickers.json', 'utf8') 
      let tickerJSON = JSON.parse(ticker);
      let finalResult = tickerJSON.filter((a: { symbol: string; }) => a.symbol == args.cryptoToLookup)

      // If the coin is not found, try to search for the name of the coin by capitalizing the first letter. 
      if (Object.keys(finalResult).length === 0) {
        let capitalizeLetter = args.cryptoToLookup.charAt(0).toUpperCase() + args.cryptoToLookup.slice(1);
        finalResult = tickerJSON.filter((a: { name: string; }) => a.name == capitalizeLetter);
      }

      // If the coin still isn't found, try to convert all the letters to uppercase and search for the symbol
      if (Object.keys(finalResult).length === 0) {
        let capitalizeAllLetters = args.cryptoToLookup.toUpperCase();
        finalResult = tickerJSON.filter((a: { symbol: string; }) => a.symbol == capitalizeAllLetters);
      }

      // If the coin *STILL* is somehow not found, the coin likely does not exist
      if (Object.keys(finalResult).length === 0) {
        return message.reply("That coin was not found.");
      }

      let embed = new Embed();
      let updated = new Date(finalResult[0].last_updated);
      let athDate = new Date(finalResult[0].quotes.USD.ath_date);

      embed.setTitle(`${finalResult[0].name} | ${finalResult[0].symbol}`)
        .setDescription(`[Click here to view chart](https://coinpaprika.com/coin/${finalResult[0].id}/)`)
        .setColor(0xfe3813)
        .setThumbnail(`attachment://logo.png`)
        .addField('Current Price', `USD$${finalResult[0].quotes.USD.price} (${Math.round(finalResult[0].quotes.USD.market_cap_change_24h)}%)`, true)
        .addField('Market Cap', `USD$${Math.round(finalResult[0].quotes.USD.market_cap)} (rank ${finalResult[0].rank})`, true)
        .addField('ATH', `USD$${finalResult[0].quotes.USD.ath_price} (${athDate.getFullYear()}-${("0" + (athDate.getMonth() + 1)).slice(-2)}-${("0" + (athDate.getUTCDate())).slice(-2)} ${athDate.getHours()}:${(athDate.getMinutes()<10?'0':'') + athDate.getMinutes()} UTC)`, true)
        .addField('Volume (24h)', `USD$${Math.round(finalResult[0].quotes.USD.volume_24h)} (${Math.round(finalResult[0].quotes.USD.volume_24h_change_24h)}%)`, true)
        .addField('Change', `1h: ${Math.round(finalResult[0].quotes.USD.percent_change_1h)}%\n12h: ${Math.round(finalResult[0].quotes.USD.percent_change_12h)}%\n24h: ${Math.round(finalResult[0].quotes.USD.percent_change_24h)}%\n7d: ${Math.round(finalResult[0].quotes.USD.percent_change_7d)}%\n30d: ${Math.round(finalResult[0].quotes.USD.percent_change_30d)}%\n1y: ${Math.round(finalResult[0].quotes.USD.percent_change_1y)}%`, true)
        .addField('Circulating Supply', finalResult[0].circulating_supply, true)
        .setFooter(`Data provided by Coinpaprika. Last updated at ${updated.getFullYear()}-${("0" + (updated.getMonth() + 1)).slice(-2)}-${("0" + (updated.getUTCDate())).slice(-2)} ${updated.getHours()}:${(updated.getMinutes()<10?'0':'') + updated.getMinutes()} UTC`)
      message.reply({embed, file: {
        filename: 'logo.png',
        value: fs.readFileSync(`./img/crypto_icons/${finalResult[0].id}.png`)
      }});
  }
}