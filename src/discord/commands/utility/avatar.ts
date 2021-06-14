import { Command, CommandClient } from "detritus-client";
import { DiscordRegexNames, Permissions } from 'detritus-client/lib/constants';
import { Embed, regex as discordRegex } from "detritus-client/lib/utils";
import { BaseCommand } from '../../structures/BaseCommand';
import { isSnowflake } from '../../structures/checks';

export const COMMAND_NAME = 'avatar';
  
export interface CommandArgs {
    noembed: boolean,
    user: string,
}

export default class AvatarCommand extends BaseCommand {
  constructor(client: CommandClient) {
    super(client, {
      name: COMMAND_NAME,
      args: [
        {name: 'noembed', default: false, type: () => true},
      ],
      label: 'user',
      permissionsClient: [
        Permissions.SEND_MESSAGES
      ],
      aliases: [
        'av',
      ],
      metadata: {
        description: 'Get a user\'s avatar.',
        examples: [`${COMMAND_NAME}`,
        `${COMMAND_NAME} 848374473701720074`,
        `${COMMAND_NAME} @neetqueen`
        ],
        type: 'utility',
        usage: '?<user:id|mention> (-noembed)',
        botOwner: false,
        nsfw: false
      }
    });
  }


  async run(payload: Command.Context, args: CommandArgs): Promise<any> {
    let message = payload.message;
    let argsUser = args.user ? args.user : payload.user.id;

    const { matches } = discordRegex(DiscordRegexNames.MENTION_USER, argsUser) as {matches: Array<{id: string}>};
    const embed = new Embed();

    if(!payload.message.channel?.can(Permissions.EMBED_LINKS)) args.noembed = true;

    if (matches.length) {
      const { id: userId } = matches[0];

      if(isSnowflake(userId)) {
        let userAvatar = payload.users.get(userId);

        if (userAvatar == undefined) {
          let userAvatar = payload.rest.fetchUser(argsUser);
          if(!args.noembed) {
            embed.setAuthor(`${(await userAvatar).name}#${(await userAvatar)?.discriminator}'s Avatar`, `https://cdn.discordapp.com/avatars/${(await userAvatar)?.id}/${(await userAvatar)?.avatar}.png`)
            embed.setDescription(`[Click here for full size](https://cdn.discordapp.com/avatars/${(await userAvatar)?.id}/${(await userAvatar)?.avatar}.png?size=2048)`)
            .setImage(`https://cdn.discordapp.com/avatars/${(await userAvatar)?.id}/${(await userAvatar)?.avatar}.png?size=512`)
          } else {
            message.reply(`**${(await userAvatar).name}#${(await userAvatar)?.discriminator}**'s Avatar URL is: https://cdn.discordapp.com/avatars/${(await userAvatar)?.id}/${(await userAvatar)?.avatar}.png`)
          }
        } else {
          if (!args.noembed) {
            embed.setAuthor(`${userAvatar?.name}#${userAvatar?.discriminator}'s Avatar`, `https://cdn.discordapp.com/avatars/${userAvatar?.id}/${userAvatar?.avatar}.png`)
            embed.setDescription(`[Click here for full size](https://cdn.discordapp.com/avatars/${userAvatar?.id}/${userAvatar?.avatar}.png?size=2048)`)
            .setImage(`https://cdn.discordapp.com/avatars/${userAvatar?.id}/${userAvatar?.avatar}.png?size=512`)
          } else {
            message.reply(`**${userAvatar?.name}#${userAvatar?.discriminator}**'s Avatar URL is: https://cdn.discordapp.com/avatars/${userAvatar?.id}/${userAvatar?.avatar}.png`)
          }
        }
      } else {
        return message.reply("Invalid Snowflake ID.");
      }
    } else {
      const { matches } = discordRegex(DiscordRegexNames.TEXT_SNOWFLAKE, argsUser) as unknown as {matches: string};
      
      if(matches.length) {
        let userId = JSON.stringify(matches);
        let finalId = JSON.parse(userId);

        if(isSnowflake(finalId[0].text)) {
          let userAvatar = payload.users.get(finalId[0].text);

          if (userAvatar == undefined) {
            let userAvatar = payload.rest.fetchUser(finalId[0].text);
            if(!args.noembed) {
              embed.setAuthor(`${(await userAvatar).name}#${(await userAvatar)?.discriminator}'s Avatar`, `https://cdn.discordapp.com/avatars/${(await userAvatar)?.id}/${(await userAvatar)?.avatar}.png`)
              embed.setDescription(`[Click here for full size](https://cdn.discordapp.com/avatars/${(await userAvatar)?.id}/${(await userAvatar)?.avatar}.png?size=2048)`)
              .setImage(`https://cdn.discordapp.com/avatars/${(await userAvatar)?.id}/${(await userAvatar)?.avatar}.png?size=512`)
            } else {
              message.reply(`**${(await userAvatar).name}#${(await userAvatar)?.discriminator}**'s Avatar URL is: https://cdn.discordapp.com/avatars/${(await userAvatar)?.id}/${(await userAvatar)?.avatar}.png`)
            }
          } else {
            if(!args.noembed) {
              embed.setAuthor(`${userAvatar?.name}#${userAvatar?.discriminator}'s Avatar`, `https://cdn.discordapp.com/avatars/${userAvatar?.id}/${userAvatar?.avatar}.png`)
              embed.setDescription(`[Click here for full size](https://cdn.discordapp.com/avatars/${userAvatar?.id}/${userAvatar?.avatar}.png?size=2048)`)
              .setImage(`https://cdn.discordapp.com/avatars/${userAvatar?.id}/${userAvatar?.avatar}.png?size=512`)
            } else {
              message.reply(`**${userAvatar?.name}#${userAvatar?.discriminator}**'s Avatar URL is: https://cdn.discordapp.com/avatars/${userAvatar?.id}/${userAvatar?.avatar}.png`)
            }
          }
        }
      } else {
        return message.reply("Invalid Snowflake ID.")
      }
    }
    
    if (!args.noembed) {
      embed.setColor(0x32cd32)
      message.reply({embed}).catch(err => message.reply("Invalid user provided or error occurred"));
    }
  }
}