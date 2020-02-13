import fs from 'fs';
import { getServerEntry } from '../src/server-entry';

function getFilename(path: string) {
  return path.split('/').pop();
}

describe('GetServerEntry', () => {
  const log = jest.spyOn(global.console, 'log').mockImplementation();

  beforeEach(async () => {
    jest.mock('fs');
    log.mockClear();
  });

  afterEach(() => {
    jest.unmock('fs');
  });

  it('should return cli entry if one is used and notify about deprecation', () => {
    expect(getServerEntry('cliPath')).toEqual('cliPath');

    expect(log).toHaveBeenCalledWith(
      expect.stringContaining(
        'Deprecation warning: --server and --entry-point',
      ),
    );
  });

  describe('index-dev', () => {
    it('should try to look for index-dev.js file if project is javascript', () => {
      fs.existsSync = jest
        .fn()
        .mockImplementation(path => getFilename(path) === 'index-dev.js');

      expect(getFilename(getServerEntry(undefined))).toEqual('index-dev.js');
    });

    it('should look for index-dev.ts file in typescript', () => {
      fs.existsSync = jest
        .fn()
        .mockImplementation(
          path =>
            getFilename(path) === 'index-dev.ts' ||
            getFilename(path) === 'tsconfig.json',
        );

      expect(getFilename(getServerEntry(undefined))).toEqual('index-dev.ts');
    });

    it('should fall back to index-dev.js file in typescript when index-dev.ts is missing', () => {
      fs.existsSync = jest
        .fn()
        .mockImplementation(
          path =>
            getFilename(path) === 'index-dev.js' ||
            getFilename(path) === 'tsconfig.json',
        );

      expect(getFilename(getServerEntry(undefined))).toEqual('index-dev.js');
    });
  });

  describe('index when index-dev not found', () => {
    it('should notify about deprecation', () => {
      fs.existsSync = jest
        .fn()
        .mockImplementation(path => getFilename(path) === 'index.js');

      getServerEntry(undefined);

      expect(log).toHaveBeenCalledWith(
        expect.stringContaining(
          'Deprecation warning: index.js is not going to be started',
        ),
      );
    });

    it('should use index.js for javascript projects', () => {
      fs.existsSync = jest
        .fn()
        .mockImplementation(path => getFilename(path) === 'index.js');

      expect(getFilename(getServerEntry(undefined))).toEqual('index.js');
    });

    it('should use index.ts for typescript project', () => {
      fs.existsSync = jest
        .fn()
        .mockImplementation(
          path =>
            getFilename(path) === 'index.ts' ||
            getFilename(path) === 'tsconfig.json',
        );

      expect(getFilename(getServerEntry(undefined))).toEqual('index.ts');
    });

    it('should use index.js if not using index-dev.js for javascript projects', () => {
      fs.existsSync = jest
        .fn()
        .mockImplementation(
          path =>
            getFilename(path) === 'index.js' ||
            getFilename(path) === 'tsconfig.json',
        );

      expect(getFilename(getServerEntry(undefined))).toEqual('index.js');
    });
  });

  it('should throw up if no entry is found', () => {
    expect.assertions(1);

    fs.existsSync = jest.fn().mockReturnValue(false);

    try {
      getServerEntry(undefined);
    } catch (e) {
      expect(e.message).toEqual(
        expect.stringContaining('Entry point is missing!'),
      );
    }
  });
});
