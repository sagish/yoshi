import path from 'path';
import fs from 'fs-extra';
import Scripts from '../../../../scripts';

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: 'javascript',
});

describe.each(['prod'] as const)(
  'fails when server entry does not exist [%s]',
  mode => {
    it('integration', async () => {
      try {
        await fs.remove(path.join(scripts.testDirectory, 'index-dev.js'));
        await fs.remove(path.join(scripts.testDirectory, './src/server.js'));

        await scripts[mode]();
      } catch (error) {
        expect(error.message).toMatch("We couldn't find your server entry");
      }
    });
  },
);
