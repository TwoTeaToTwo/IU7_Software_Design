import { createCLI } from "./commands.ts";

const cli_command = createCLI();
await cli_command.parse(Deno.args);
