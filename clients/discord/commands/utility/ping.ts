/*---------------------------------------------------*/
import { Description, Discord, Option, Slash } from "@typeit/discord";
import { CommandInteraction } from "discord.js";
/*---------------------------------------------------*/
import * as Ping from "ping";

@Discord()
export abstract class PingCommand {
    @Slash("ping")
    @Description('Ping Pong the Bot! 🏓 You can also ping a website or IP address!')
    async ping(
        @Option("website", {description: "Enter an IP or Website to ping (optional)", required: false})
        website: string,
        interaction: CommandInteraction
    ) {
        if (website == null) { // User did not specify url
            interaction.reply("Pong! :)");
        }

        else {
            interaction.defer();
            Ping.promise.probe(website).then(function (res) {
                interaction.editReply(`\`\`\`${res.output || "An unknown error has occurred"}\`\`\``)
            });
        }
    }
}