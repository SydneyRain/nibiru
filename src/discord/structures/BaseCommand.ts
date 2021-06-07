/*---------------------------------------------------*/
import { Command, CommandClient } from "detritus-client";
import { ParsedArgs } from 'detritus-client/lib/command';
/*---------------------------------------------------*/
import YAML from "yaml";
import * as fs from 'fs';
/*---------------------------------------------------*/
const file = fs.readFileSync('./config.yaml', 'utf8')
const config = YAML.parse(file)
/*---------------------------------------------------*/

export interface CommandMetadata {
  description: string;
  usage: string;
  nsfw?: boolean;
  botOwner?: boolean;
}

export class BaseCommand<ParsedArgsFinished = Command.ParsedArgs> extends Command.Command<ParsedArgsFinished> {
  declare metadata: CommandMetadata;

  constructor(commandClient: CommandClient, options: Partial<Command.CommandOptions>) {
    super(
      commandClient,
      {
        name: '',
        ratelimits: [{ duration: 5000, limit: 5, type: 'guild' }],
        ...options,
      },
    );
  }
  
  onBeforeRun(context: Command.Context, args: ParsedArgs) {
    if (context.command?.metadata.botOwner) {
      if(context.userId !== config.botConfig.discordConfig.botOwner) { 
        console.log('Unauthorized user tried to use Bot Owner command!')
        return false;
      }
      return true;
    }

    return true;
  }

  async onSuccess(context: Command.Context, args: ParsedArgsFinished) {
    
  }

  async onRunError(context: Command.Context, args: ParsedArgsFinished, error: any) {
    console.log({ context, args, error, type: 'onRunError' });
  }

  async onTypeError(context: Command.Context, args: ParsedArgsFinished, errors: Command.ParsedErrors) {
    console.log({ context, args, errors, type: 'onTypeError' });
  }
}