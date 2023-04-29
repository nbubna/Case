// @ts-check

import { terser } from 'rollup-plugin-terser';

/**
 * @type { import('rollup').RollupOptions }
 */
const config =  {
    input: './src/Case.mjs',
    output: [
        {
            file: './dist/Case.js',
            format: 'umd',
            name: 'Case',
            sourcemap: true,
            sourcemapExcludeSources: true,
        },
        {
            file: './dist/Case.mjs',
            format: 'esm',
            sourcemap: true,
            sourcemapExcludeSources: true,
        },
        {
            file: './dist/Case.min.js',
            format: 'umd',
            name: 'Case',
            sourcemap: true,
            sourcemapExcludeSources: true,
            plugins: [terser()],
        },
        {
            file: './dist/Case.min.mjs',
            format: 'esm',
            sourcemap: true,
            sourcemapExcludeSources: true,
            plugins: [terser()],
        },
    ],
};

export default config;
