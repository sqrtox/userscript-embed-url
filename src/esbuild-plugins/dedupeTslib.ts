import { join, parse } from 'node:path';
import { type Plugin } from 'esbuild';

const tslib = join(parse(require.resolve('tslib')).dir, 'tslib.es6.js');

export const dedupeTslib = (): Plugin => ({
  name: 'dedupe-tslib',
  setup: ({ onResolve }) => {

    onResolve({ filter: /^tslib$/ }, () => ({
      path: tslib
    }));
  }
});
