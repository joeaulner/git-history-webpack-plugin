const path = require('path');
const GitHistoryWebpackPlugin = require('../index');

module.exports = {
    mode: 'development',
    context: path.resolve(__dirname, 'src'),
    entry: './index.js',
    node: {
        __filename: true
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new GitHistoryWebpackPlugin()
    ]
};
