/*---------------------------------------------------*/
import { Description, Discord, Option, Slash } from "@typeit/discord";
import { ClientUser, CommandInteraction } from "discord.js";
/*---------------------------------------------------*/
import * as Insult from "insult";

@Discord()
export abstract class InsultCommand {
    @Slash("insult")
    @Description('Insult someone 😈 (or yourself)')
    async insult(
        @Option("victim", "MENTIONABLE", {description: "The person to insult", required: false})
        victim: ClientUser,
        interaction: CommandInteraction
    ) {
        return interaction.reply(`<@${victim ? victim : interaction.user.id}>, ${Insult.Insult()}`);
    }
}