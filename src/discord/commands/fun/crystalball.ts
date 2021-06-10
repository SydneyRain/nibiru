import { CommandClient } from "detritus-client";
import { Permissions } from 'detritus-client/lib/constants';
import { Context } from "detritus-client/lib/command";
import { Embed } from "detritus-client/lib/utils";
import { BaseCommand } from '../../structures/BaseCommand';
/*---------------------------------------------------*/

export interface CommandArgsBefore {
  question: string
}

export interface CommandArgs {
  question: string
}

export const COMMAND_NAME = 'crystalball';

export default class CrystalBallCommand extends BaseCommand {
  constructor(client: CommandClient) {
    super(client, {
      name: COMMAND_NAME,
      permissionsClient: [
        Permissions.SEND_MESSAGES,
        Permissions.EMBED_LINKS,
      ],
      onPermissionsFailClient: (context) => context.reply(`Error: Missing Embed permissions!`),
      aliases: [
        'cb'
      ],
      label: 'question',
      metadata: {
        description: 'Ask the Crystal Ball to investigate uncertainty.',
        examples: [COMMAND_NAME],
        type: 'fun',
        usage: `${COMMAND_NAME} Will I be lucky today?`,
        botOwner: false,
        nsfw: false
      }
    });
  }

  async run(payload: Context, args: CommandArgs): Promise<any> {
    const message = payload.message;
    const responses = ["Without a doubt. What you want to happen is about to happen! Get ready for your dreams to come true!",
    "This is unlikely. It's not possible unless you either take a drastic measure (if you want it to work out) or make a huge blunder (which the Crystal Ball knows you can avoid).",
    "Give it time. Your wish is bound to manifest eventually, but it might come slower than you'd like. You must be patient, or you might lose your chance!",
    "Maybe, if you do nothing. If your hands are tied, this is a possibility. But the only way to make your future definite is to untie your hands and seize the day!",
    "No, the Crystal Ball doesn't think so. But don't give up on your dreams! You can get what you want, but it might take a little extra work."];

    const embed = new Embed();
    
    embed.setTitle('Ask the Crystal Ball')
      .setColor(0x6f41a8)
      .setThumbnail('https://i.ibb.co/vkqRpbj/Crystal-Magic-Ball-Emoji.png')
      .addField('Question', args.question)
      .addField('Answer', `${responses[Math.floor(Math.random()*responses.length)]}`)
    
    message.reply({embed});
  }
}