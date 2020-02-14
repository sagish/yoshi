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
    it('should try to look for index-dev.ts file', () => {
      fs.existsSync = jest
        .fn()
        .mockImplementation(path => getFilename(path) === 'index-dev.ts');

      expect(getFilename(getServerEntry(undefined))).toEqual('index-dev.ts');
    });

    it('should fall back to index-dev.js file when index-dev.ts is missing', () => {
      fs.existsSync = jest
        .fn()
        .mockImplementation(path => getFilename(path) === 'index-dev.js');

      expect(getFilename(getServerEntry(undefined))).toEqual('index-dev.js');
    });
  });

  describe('when index-dev is not found try to find index', () => {
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

    it('should try to look for index.ts file', () => {
      fs.existsSync = jest
        .fn()
        .mockImplementation(path => getFilename(path) === 'index.ts');

      expect(getFilename(getServerEntry(undefined))).toEqual('index.ts');
    });

    it('should fall back to index.js file when index.ts is missing', () => {
      fs.existsSync = jest
        .fn()
        .mockImplementation(path => getFilename(path) === 'index.js');

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
