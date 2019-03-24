//@ts-check
/** @typedef {import("webpack/lib/Compiler")} WebpackCompiler */
/** @typedef {import("webpack/lib/Compilation")} WebpackCompilation */

class GitHistoryWebpackPlugin {
    /**
     * called by webpack on init with the compiler instance
     * @param {WebpackCompiler} compiler
     */
    apply(compiler) {
        compiler.hooks.compilation.tap('GitTimestampsPlugin', (compilation, compilationParams) => {
            compilation.hooks.buildModule.tap('GitTimestampsPlugin', (module) => {
                // TODO: add module to global map of all histories
                // TODO: add global map to module dependencies list (can I do that if I don't have the full contents yet?)

                // TODO: maybe I just output an additional json asset containing all the data, then require it from a SB addon?
                console.log(module.resource);
            });
        });
    }
}

module.exports = GitHistoryWebpackPlugin;
