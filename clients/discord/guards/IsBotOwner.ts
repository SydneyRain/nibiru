import { GuardFunction } from "@typeit/discord";
import { CommandInteraction } from "discord.js";

export const IsBotOwner: GuardFunction<CommandInteraction> = async (
  interaction,
  client,
  next
) => {

    if(interaction.user.id !== '145788286156144641') {
        return interaction.reply('You are not allowed to use this command.');
    }
    else {
        await next();
    }
};