// eslint-disable-next-line import/no-extraneous-dependencies
import webpack from 'webpack';
import { createBaseWebpackConfig } from 'yoshi-common/webpack.config';
import { isTypescriptProject } from 'yoshi-helpers/queries';
import { FlowEditorConfig } from './bin/yoshi-flow-editor';

const useTypeScript = isTypescriptProject();

const createDefaultOptions = (config: FlowEditorConfig) => {
  const separateCss = false;

  return {
    name: config.name as string,
    useTypeScript,
    typeCheckTypeScript: useTypeScript,
    useAngular: false,
    devServerUrl: 'https://localhost:3200/',
    separateCss,
    enhancedTpaStyle: true,
  };
};

export function createClientWebpackConfig(
  config: FlowEditorConfig,
  {
    isDev,
    isHot,
    isAnalyze,
    forceEmitSourceMaps,
    customEntry,
  }: {
    isDev?: boolean;
    isHot?: boolean;
    isAnalyze?: boolean;
    forceEmitSourceMaps?: boolean;
    customEntry?: any;
  } = {},
): webpack.Configuration {
  const defaultOptions = createDefaultOptions(config);

  const clientConfig = createBaseWebpackConfig({
    configName: 'client',
    target: 'web',
    isDev,
    isHot,
    isAnalyze,
    forceEmitSourceMaps,
    exportAsLibraryName: '[name]',
    cssModules: true,
    ...defaultOptions,
  });

  clientConfig.entry = customEntry;
  clientConfig.externals = {
    react: {
      amd: 'react',
      umd: 'react',
      commonjs: 'react',
      commonjs2: 'react',
      root: 'React',
    },
    'react-dom': {
      amd: 'reactDOM',
      umd: 'react-dom',
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      root: 'ReactDOM',
    },
  };

  return clientConfig;
}

export function createServerWebpackConfig(
  config: FlowEditorConfig,
  { isDev, isHot }: { isDev?: boolean; isHot?: boolean } = {},
): webpack.Configuration {
  const defaultOptions = createDefaultOptions(config);

  const serverConfig = createBaseWebpackConfig({
    configName: 'server',
    target: 'node',
    isDev,
    isHot,
    ...defaultOptions,
  });

  serverConfig.entry = async () => {
    const serverEntry = '../node_modules/yoshi-flow-editor/build/server/server';

    const entryConfig = {
      server: serverEntry,
    };

    return entryConfig;
  };

  return serverConfig;
}

export function createWebWorkerWebpackConfig(
  config: FlowEditorConfig,
  {
    isDev,
    isHot,
    customEntry,
    webWorkerExternals,
  }: {
    isDev?: boolean;
    isHot?: boolean;
    customEntry?: any;
    webWorkerExternals?: any;
  } = {},
): webpack.Configuration {
  const defaultOptions = createDefaultOptions(config);

  const workerConfig = createBaseWebpackConfig({
    configName: 'web-worker',
    target: 'webworker',
    isDev,
    isHot,
    ...defaultOptions,
  });

  workerConfig.output!.library = '[name]';
  workerConfig.output!.libraryTarget = 'umd';
  workerConfig.output!.globalObject = 'self';

  workerConfig.entry = customEntry;

  workerConfig.externals = webWorkerExternals;

  return workerConfig;
}
