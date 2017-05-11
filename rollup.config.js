import nodeResolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";

export default {
    entry: 'build/main.js',
    format: 'cjs',
    plugins: [
        nodeResolve({
            module: true,
            jsnext: true,
            main: true,
            browser: true,
            source_map: true
        }),
        commonjs()
    ],
    dest: 'build/output.js'
};
