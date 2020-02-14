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

  const indexDevTS = path.resolve('index-dev.ts');
  const indexDevJS = path.resolve('index-dev.js');

  if (fs.existsSync(indexDevTS)) {
    return indexDevTS;
  }

  if (fs.existsSync(indexDevJS)) {
    return indexDevJS;
  }

  const indexTS = path.resolve(`index.ts`);
  const indexJS = path.resolve(`index.js`);

  const indexTSExists = fs.existsSync(indexTS);

  if (indexTSExists || fs.existsSync(indexJS)) {
    console.log(
      chalk.yellow(
        `Deprecation warning: index.${
          indexTSExists ? 'ts' : 'js'
        } is not going to be started automatically in Yoshi v5. Please use index-dev.${extension} instead`,
      ),
    );

    return indexTSExists ? indexTS : indexJS;
  }

  throw new Error(
    `Entry point is missing! Please create index-dev.${extension} in project root`,
  );
};
