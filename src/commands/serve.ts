/** @format */

import { Command } from 'commander';
import { serve } from 'local-api';
import path from 'path';

//will be always false on our system and will be always true on user's machine
const isProd = process.env.NODE_ENV === 'production';

//all user provided values are given as a string
export const serveCommand = new Command()
  .command('serve [filename]')
  .description('Open file for editing')
  .option('-p, --port <number>', 'port to run server on', '4005')
  .action(async (filename = 'notebook.js', options: { port: string }) => {
    try {
      const dir = path.join(process.cwd(), path.dirname(filename));
      await serve(
        parseInt(options.port),
        path.basename(filename),
        dir,
        !isProd
      );
      console.log(
        `Opened ${filename}. Navigate to http://localhost:${options.port} to edit the file.`
      );
    } catch (error: any) {
      //SAME PORT ERROR
      if (error.code === 'EADDRINUSE') {
        console.log(
          'Port is in use. Try running on a different port by "node index.js serve --port=<another_port>".'
        );
      } else {
        console.log('Here is the problem', error.message);
      }
      //exit the programm on unsuccessful operation
      process.exit(1);
    }
  });
