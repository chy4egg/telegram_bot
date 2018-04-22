var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: "./src/app.js",
    target: 'node',
    output: {
        path: path.join(__dirname, 'app'),
        filename: 'bundle.js'
    },

    mode: 'none',

    module: {
        rules: [
            {
                test: /\.js$/,
                include: '/src/',
                exclude: /node_modules/,
                loader: "babel-loader"
            }
        ]
    }
};