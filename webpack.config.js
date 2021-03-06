var webpack = require('webpack'),
    precss = require('precss'),
    cssnext = require('cssnext'),
    clearfix = require('postcss-clearfix'),
    prefix = require('autoprefixer'),
    normalize = require('postcss-normalize'),
    postcssImport = require('postcss-import');

module.exports = {
    entry: './app/main.js',
    output: {
        filename: './dist/bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader?modules!postcss-loader'
            }
        ]
    },
    postcss: function() {
        return [
            postcssImport,
            normalize,
            prefix,
            precss,
            cssnext,
            clearfix
        ];
    }
}