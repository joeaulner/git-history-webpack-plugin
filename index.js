//@ts-check
/** @typedef {import("webpack/lib/Compiler")} WebpackCompiler */
/** @typedef {import("webpack/lib/Compilation")} WebpackCompilation */
/** @typedef {import("webpack/lib/NormalModuleFactory")} NormalModuleFactory */
/** @typedef {import("webpack/lib/Parser")} Parser */
/** @typedef {import("webpack/lib/Module")} Module */

const childProcess = require('child_process');

const pluginName = 'GitHistoryWebpackPlugin';

class GitHistoryWebpackPlugin {
    constructor() {
        this.modules = {};
    }

    /**
     * called by webpack on init with the compiler instance
     * @param {WebpackCompiler} compiler
     */
    apply(compiler) {
        compiler.hooks.normalModuleFactory.tap(pluginName, (factory) => {
            factory.hooks.parser.for('javascript/auto').tap(pluginName, (parser, parserOptions) => {
                parser.hooks.importCall.tap(pluginName, (statement) => {
                    if (statement.arguments[0].value.includes('git-history.js')) {
                        return true;
                    }
                });
            });
        });

        compiler.hooks.compilation.tap(pluginName, (compilation, compilationParams) => {
            compilation.hooks.buildModule.tap(pluginName, (module) => {
                // TODO: add module to global map of all histories
                // TODO: add global map to module dependencies list (can I do that if I don't have the full contents yet?)

                // TODO: maybe I just output an additional json asset containing all the data, then require it from a SB addon?

                if (module.resource.includes('node_modules')) {
                    return;
                }

                this.modules[module.resource] = childProcess.execSync('git log -1').toString();
            });
        });

        compiler.hooks.emit.tap(pluginName, (compilation) => {
            const getSource = () => `export default ${JSON.stringify(this.modules)};`;
            compilation.assets['git-history.js'] = {
                source: getSource,
                size: () => getSource().length
            };
        });
    }
}

module.exports = GitHistoryWebpackPlugin;
