const path = require("path");
const slsw = require("serverless-webpack");
// const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = {
  mode: slsw.lib.webpack.isLocal ? "development" : "production",
  entry: slsw.lib.entries,
  // devtool: "no-source-map",
  resolve: {
    extensions: [".mjs", ".js", ".json", ".ts"]
  },
  output: {
    libraryTarget: "commonjs2",
    path: path.join(__dirname, ".webpack"),
    filename: "[name].js"
  },
  target: "node",
  externals: [/aws-sdk/],
  module: {
    rules: [{ test: /\.tsx?$/, loader: "ts-loader" }]
  }
  // plugins: [new BundleAnalyzerPlugin()]
};
