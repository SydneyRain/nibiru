import { Slash } from "detritus-client";

export interface CommandMetadata {
  description?: string;
  usage?: string;
  nsfw?: boolean;
  botOwner?: boolean;
}

export class BaseCommand<ParsedArgsFinished = Slash.ParsedArgs> extends Slash.SlashCommand<ParsedArgsFinished> {
  constructor(data: Slash.SlashCommandOptions = {}) {
    super(Object.assign({
      permissionsIgnoreClientOwner: true,
    }, data));
  }

  async onRunError(context: Slash.SlashContext, args: ParsedArgsFinished, error: any) {
    console.log({ context, args, error, type: 'onRunError' });
  }

  async onTypeError(context: Slash.SlashContext, args: ParsedArgsFinished, error: any) {
    console.log({ context, args, error, type: 'onTypeError' });
  }
}