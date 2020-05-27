const path = require('path');
const ProgressBarWebpackPlugin = require('progress-bar-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const autoprefixer = require('autoprefixer');

const resolvePath = (dir) => {
    return path.resolve(__dirname, '../', dir);
};

let baseConfig = {
    resolve: {
        alias: {
            src: resolvePath('src')
        },
        extensions: ['.js', '.vue', '.scss', '.css', '.json']
    },
    stats: {
        chunks: false,
        children: false,
        entrypoints: false,
        modules: false
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: 'vue-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            }
        ]
    },
    plugins: [
        new ProgressBarWebpackPlugin(),
        new VueLoaderPlugin()
    ]
};

module.exports = baseConfig;
