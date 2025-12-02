import chalk from "chalk";
import knex from "knex";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import config from "../../knexfile.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cliArguments = process.argv
  .slice(2)
  .reduce((previousValue, currentValue) => {
    const [key, value] = currentValue.split("=");
    previousValue[key.replaceAll("-", "")] = value;
    return previousValue;
  }, {});

if (!cliArguments.file) {
  console.error(
    chalk.red(`Error: file argument is required. eg: --file=example.js`)
  );
  process.exit(0);
}

const fileName = cliArguments.file;

// ✅ Resolve the absolute path to the script file
const scriptPath = path.resolve(__dirname, fileName);

async function runScript() {
  const module = await import(pathToFileURL(scriptPath).href);
  const knexConfig = config[process.env["NODE_ENV"]];
  const client = knex(knexConfig);
  await module.script(client);

  process.exit(0);
}

runScript().catch((error) => {
  console.error(chalk.red(`Error: ${error.message}`));
  process.exit(0);
});
