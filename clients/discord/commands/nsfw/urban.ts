/*---------------------------------------------------*/
import { Description, Discord, Option, Slash } from "@typeit/discord";
import { CommandInteraction, MessageEmbed } from "discord.js";
/*---------------------------------------------------*/
import axios from "axios";
/*---------------------------------------------------*/

@Discord()
export abstract class UrbanCommand {
    @Slash("urban")
    @Description('Look up a word on the Urban Dictionary')
    async urban(
        @Option("word", {description: "The word to look up", required: true})
        wordToLookup: string,
        interaction: CommandInteraction
    ) {
        //todo: Add buttons to go through definitions
        await axios.get(`https://api.urbandictionary.com/v0/define?term=${wordToLookup}`).then(res =>
        {
            if (res.status != 200) { return interaction.reply('Error fetching data from Urban Dictionary :( Please try again later!'); }
            if (res.data?.list.length <= 0) { return interaction.reply('No results for this word were found...') }

            let wordResult:any = res.data.list[0];

            interaction.reply({
                embeds: [
                    new MessageEmbed({
                        author: {
                            name: 'Urban Dictionary',
                            iconURL: 'https://i.ibb.co/PZsnHZ6/ud.jpg',
                        },
                        title: wordResult.word,
                        description: wordResult.definition,
                        fields: [
                            {
                                name: 'Example',
                                value: wordResult.example
                            },
                            {
                                name: 'Score',
                                value: `${wordResult.thumbs_up - wordResult.thumbs_down} (${wordResult.thumbs_up} 👍 ${wordResult.thumbs_down} 👎)`
                            }
                        ],
                        footer: { text: `By ${wordResult.author} - ${wordResult.written_on.replace(/T/, ' ').replace(/\..+/, '')}` }
                    }),
                ],
            });
        });
    }
}