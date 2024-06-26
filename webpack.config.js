"use strict";
const webpack = require('webpack');
const TerserPlugin = require("terser-webpack-plugin");
const path = require('path');
const productionBuild = (process.env.NODE_ENV == "production");
let plugins = [];

plugins.push(
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
);


module.exports = {
    entry: [
        "./src/entry-point.tsx"
    ],
    target: "web",
    output: {
        filename: productionBuild ? "librarie.min.js" : "librarie.js",
        path: path.join(__dirname, '/dist'),
        publicPath: "./dist/",
        libraryTarget: "umd",
        library: "LibraryEntryPoint",
    },
    optimization:{
        minimize: !!productionBuild,
        minimizer: [new TerserPlugin({terserOptions:{mangle:{reserved:["on","__webpack_require__"]}}})],
    },
    mode:productionBuild? "production":"development",
    plugins: plugins,

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        modules: [
            "node_modules"
        ],

        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader' // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
            },
            {
                test: /\.js$/,
                enforce: "pre",
                loader: "source-map-loader" // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(?:ttf|otf|eot|woff|svg|png)$/,
                type: 'asset/resource',
                generator:{
                    filename:'resources/[name][ext][query]'
                }
            }
        ]
    }
}
