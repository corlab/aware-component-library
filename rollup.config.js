import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import postcss from 'rollup-plugin-postcss';
import rename from 'rollup-plugin-rename';

const packageJson = require("./package.json");

export default {
    input: "src/index.ts",
    output: [
        {
            dir: packageJson.module,
            format: "esm",
            preserveModules: true,
            sourcemap: true
        }
    ],
    plugins: [
        peerDepsExternal({includeDependencies: true}),
        resolve(),
        typescript({useTsconfigDeclarationDir: true}),
        postcss({extensions: ['.css'],}),
        rename({
            include: ['**/*.js','**/*.ts','**/*.jsx','**/*.tsx','**/*.css' ],
            map: (name) => name
                .replace('src/', '')
                .replace('node_modules/', 'external/')
                .replace('../../external', '../external'),
        })
    ],

};
