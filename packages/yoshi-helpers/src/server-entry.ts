import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { isTypescriptProject } from './queries';

export const getServerEntry = (serverEntryCLI?: string) => {
  const extension = isTypescriptProject() ? 'ts' : 'js';

  if (serverEntryCLI) {
    console.log(
      chalk.yellow(
        `Deprecation warning: --server and --entry-point is going to be removed in Yoshi v5. Please create 'index-dev.${extension}' in your root directory instead of using these flags.`,
      ),
    );
    return serverEntryCLI;
  }

  const indexDev = path.resolve(`index-dev.${extension}`);

  if (fs.existsSync(indexDev)) {
    return indexDev;
  }

  const indexDevJS = path.resolve(`index-dev.js`);

  if (fs.existsSync(indexDevJS)) {
    return indexDevJS;
  }

  const index = path.resolve(`index.${extension}`);
  const indexJS = path.resolve(`index.js`);
  if (fs.existsSync(index) || fs.existsSync(indexJS)) {
    console.log(
      chalk.yellow(
        `Deprecation warning: index.${extension} is not going to be started automatically in Yoshi v5. Please use index-dev.${extension} instead`,
      ),
    );

    return fs.existsSync(index) ? index : indexJS;
  }

  throw new Error(
    `Entry point is missing! Please create index-dev.${extension} in project root`,
  );
};
