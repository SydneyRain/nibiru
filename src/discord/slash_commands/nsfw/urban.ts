import { Slash } from 'detritus-client';
import { ApplicationCommandOptionTypes, InteractionCallbackTypes } from 'detritus-client/lib/constants';
import { Embed } from 'detritus-client/lib/utils';
import { BaseCommand } from "../../structures/BaseCommandSlash";
/*---------------------------------------------------*/
import axios from "axios";
/*---------------------------------------------------*/

export const COMMAND_NAME = 'urban';

export interface CommandArgs {
  word: string
}

export default class UrbanCommand extends BaseCommand {
  description = 'Look up a word on the Urban Dictionary.';
  name = COMMAND_NAME;

  constructor() {
    super({
      options: [
        {name: 'word', type: ApplicationCommandOptionTypes.STRING, description: 'The word to look up.', required: true}
      ],
    })
  }

  async run(context: Slash.SlashContext, args: CommandArgs) {
    await axios.get(`https://api.urbandictionary.com/v0/define?term=${args.word}`).then(res =>
    {
      if (res.status != 200) { return context.respond(InteractionCallbackTypes.CHANNEL_MESSAGE_WITH_SOURCE, 'Error fetching data from Urban Dictionary :( Please try again later!'); }
      if (res.data?.list.length <= 0) { return context.respond(InteractionCallbackTypes.CHANNEL_MESSAGE_WITH_SOURCE, 'No results for this word were found...') }

      let wordResult:any = res.data.list[0];

      const embed = new Embed();
      
      embed.setTitle(wordResult.word)
        .setAuthor('Urban Dictionary', 'https://i.ibb.co/PZsnHZ6/ud.jpg')
        .setColor(0xfe3813)
        .setDescription(wordResult.definition)
        .setFooter(`By ${wordResult.author} - ${wordResult.written_on.replace(/T/, ' ').replace(/\..+/, '')}`)
        .addField('Example', wordResult.example)
        .addField('Score', `${wordResult.thumbs_up - wordResult.thumbs_down} (${wordResult.thumbs_up} 👍 ${wordResult.thumbs_down} 👎)`)
      
      return context.respond(InteractionCallbackTypes.CHANNEL_MESSAGE_WITH_SOURCE, {embed});
    });
  }
};