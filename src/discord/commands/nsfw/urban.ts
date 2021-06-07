/* Todo:
Make it check if it has embed permissions (if not send a plain text version)
Buttons to go to the next definiton
*/
import { CommandClient } from "detritus-client";
import { Context } from "detritus-client/lib/command";
import { Embed } from "detritus-client/lib/utils";
import { BaseCommand } from '../../structures/BaseCommand';
/*---------------------------------------------------*/
import axios from "axios";
/*---------------------------------------------------*/

export interface CommandArgsBefore {
  wordToLookup: string
}

export interface CommandArgs {
  wordToLookup: string
}

export const COMMAND_NAME = 'urban';

export default class UrbanCommand extends BaseCommand {
  constructor(client: CommandClient) {
    super(client, {
      name: COMMAND_NAME,
      aliases: [
        'ub'
      ],
      label: 'wordToLookup',
      metadata: {
        description: 'Look up a word on the Urban Dictionary.',
        examples: [COMMAND_NAME],
        type: 'nsfw',
        usage: `${COMMAND_NAME}`,
        botOwner: false,
        nsfw: false
      }
    });
  }

  async run(payload: Context, args: CommandArgs): Promise<any> {
    
    await axios.get(`https://api.urbandictionary.com/v0/define?term=${args.wordToLookup}`).then(res =>
    {
      const message = payload.message;
      if (res.status != 200) { return message.reply('Error fetching data from Urban Dictionary :( Please try again later!'); }
      if (res.data?.list.length <= 0) { return message.reply('No results for this word were found...') }

      let wordResult:any = res.data.list[0];

      const embed = new Embed();
      
      embed.setTitle(wordResult.word)
        .setAuthor('Urban Dictionary', 'https://i.ibb.co/PZsnHZ6/ud.jpg')
        .setColor(0xfe3813)
        .setDescription(wordResult.definition)
        .setFooter(`By ${wordResult.author} - ${wordResult.written_on.replace(/T/, ' ').replace(/\..+/, '')}`)
        .addField('Example', wordResult.example)
        .addField('Score', `${wordResult.thumbs_up - wordResult.thumbs_down} (${wordResult.thumbs_up} 👍 ${wordResult.thumbs_down} 👎)`)
      
      message.reply({embed});
    });
  }
}