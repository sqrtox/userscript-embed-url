import { build, type BuildOptions } from 'esbuild';
import { stringify, type Metadata } from 'userscript-metadata';
import pkg from '~package.json';
import { readIcon } from '~/utils/readIcon';
import { dedupeTslib } from '~/esbuild-plugins/dedupeTslib';

(async () => {
  const metadata: Metadata = {
    name: 'Embed URL',
    'name:ja': '埋め込みを追加する',
    description: pkg.description,
    'description:ja': 'URLに画像や動画などの対応する埋め込みを追加するユーザースクリプトです。',
    version: pkg.version,
    icon: await readIcon('./src/assets/icon.png'),
    match: '*://*/*',
    connect: [
      'imgur.com',
      'i.imgur.com',
      'publish.twitter.com',
      'www.instagram.com'
    ],
    namespace: pkg.repository.url.replace(/^git\+|\.git$/g, ''),
    author: pkg.author,
    license: pkg.license,
    grant: 'GM.xmlHttpRequest'
  };

  const options: BuildOptions = {
    entryPoints: ['src/index.ts'],
    bundle: true,
    target: 'es2022',
    charset: 'utf8',
    platform: 'browser',
    outfile: `dist/${pkg.name.replace(/^userscript-/, '')}.user.js`,
    banner: {
      js: stringify(metadata)
    },
    legalComments: 'inline',
    plugins: [dedupeTslib()]
  };

  await build(options).catch(err => {
    process.stderr.write(err.stderr);
    process.exit(1);
  });
})();
