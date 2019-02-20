const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const webpack = require("webpack")

module.exports = function (env, argv) {

  let isProd = argv.mode === "production"

  let conf = {
    entry: {
      main: path.resolve(__dirname, "src/main.ts"),
      vendor: ["babylonjs", "oimo", "cannon"]
    },

    resolve: {
      enforceExtension: false,
      alias: {
        Assets: path.resolve(__dirname, "src/assets/"),
        Engine: path.resolve(__dirname, "src/engine/"),
        Scene: path.resolve(__dirname, "src/scene/"),
        Objects: path.resolve(__dirname, "src/objects/"),
        Classes: path.resolve(__dirname, "src/classes/"),
        JS: path.resolve(__dirname, "src/"),
        Gameplay: path.resolve(__dirname, "src/gameplay/"),
        Lib: path.resolve(__dirname, "src/lib/")
      }
    },

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "ts-loader",
          exclude: /node_modules/
        },
        {
          test: /\.pug$/,
          use: "pug-loader"
        },
        {
          test: /\.scss$/,
          use: ["style-loader", "css-loader", "sass-loader"]
        }
      ]
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "src", "assets", "pug", "index.pug")
      }),
      new webpack.DefinePlugin({
        PRODUCTION: isProd
      })
    ],

    output: {
      path: path.resolve(__dirname, "dist"),
      filename: isProd ? "[name]-[hash].js" : "[name].js"
    },

    optimization: {
      splitChunks: {
        // include all types of chunks
        chunks: "all"
      }
    }
  }

  return conf
}
