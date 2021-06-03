/*---------------------------------------------------*/
import { Description, Discord, Guard, Option, Slash } from "@typeit/discord";
import { CommandInteraction } from "discord.js";
/*---------------------------------------------------*/

@Discord()
export abstract class EvalCommand {
    @Slash("eval")
    @Description('Run eval command. (BOT OWNER ONLY)')
    async eval(
        @Option("code", {description: "The code to execute.", required: true})
        code: string,
        interaction: CommandInteraction
    ) {
        let result: string, error: string;

        try { 
            result = eval(code);
            interaction.reply(`\`\`\`js\n${this.clean(result)}\`\`\``);
        } catch(err) {
            error = err;
            interaction.reply(`\`\`\`js\n${this.clean(error)}\`\`\``);
        }
    }

    clean(text) {
      if (typeof text === "string")
        return text
          .replace(/`/g, "`" + String.fromCharCode(8203))
          .replace(/@/g, "@" + String.fromCharCode(8203));
      else return text;
    }
}