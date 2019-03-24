//@ts-check
/** @typedef {import("webpack/lib/Compiler")} WebpackCompiler */
/** @typedef {import("webpack/lib/Compilation")} WebpackCompilation */

const childProcess = require('child_process');

class GitHistoryWebpackPlugin {
    constructor() {
        this.name = 'GitHistoryWebpackPlugin';
        this.moduleHistories = {};
    }

    /**
     * called by webpack on init with the compiler instance
     * @param {WebpackCompiler} compiler
     */
    apply(compiler) {
        compiler.hooks.normalModuleFactory.tap(this.name, (factory) => {
            factory.hooks.parser.for('javascript/auto').tap(this.name, (parser, parserOptions) => {
                parser.hooks.importCall.tap(this.name, (statement) => {
                    if (statement.arguments[0].value.includes('git-history.js')) {
                        return true;
                    }
                });
            });
        });

        compiler.hooks.compilation.tap(this.name, (compilation, compilationParams) => {
            const modified = childProcess
                .execSync('git status -s', { cwd: compiler.context })
                .toString()
                .split(/\n+/)
                .filter((filename) => filename)
                .map((line) => line.trim().split(' ')[1].replace(/\//g, '\\'));

            compilation.hooks.buildModule.tap(this.name, (module) => {
                if (!module.resource || module.resource.includes('node_modules')) {
                    return;
                }

                const filename = module.resource.replace(`${compiler.context}\\`, '');
                let moduleHistory = childProcess.execSync('git log -1').toString();
                if (modified.includes(filename)) {
                    moduleHistory = `(modified locally)\n${moduleHistory}`;
                }
                this.moduleHistories[filename] = moduleHistory;
            });
        });

        compiler.hooks.emit.tap(this.name, (compilation) => {
            const getSource = () => `export default ${JSON.stringify(this.moduleHistories)};`;
            compilation.assets['git-history.js'] = {
                source: getSource,
                size: () => getSource().length
            };
        });
    }
}

module.exports = GitHistoryWebpackPlugin;
