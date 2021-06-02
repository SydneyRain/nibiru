import { Discord, Slash } from "@typeit/discord";
import { CommandInteraction } from "discord.js";

@Discord()
export abstract class HelloWorld {
    @Slash("hello")
    ping(interaction: CommandInteraction) {
        interaction.reply("Hi! :)");
    }
}