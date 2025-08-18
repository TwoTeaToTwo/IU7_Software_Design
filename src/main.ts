import { createCLI } from "@podcast/cli";

const cli_command = createCLI();
await cli_command.parse(Deno.args);
