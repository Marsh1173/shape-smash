const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

const contentBase = path.join(__dirname, "public");

module.exports = {
  entry: "./src/client/main",
  devServer: {
    port: 3000,
    static: {
      directory: contentBase,
    },
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.less$/i,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /\.m?js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  optimization: {
    minimizer: [
      // This disables the production of random bundle.js.LICENSE.txt files in the output
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
  output: {
    filename: "bundle.js",
    path: contentBase,
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".less", ".css"],
  },
};
