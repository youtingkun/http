const path = require("path");
module.exports = {
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    libraryTarget: "umd", // 保持原函数名
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    // 处理ts或tsx文件的两种方案：
    // 方案1：对ts文件也使用babel-loader，然后在.babelrc里面使用"@babel/preset-typescript"，不会使用tsconfig.json里面的配置。
    // 方案2：对ts文件使用ts-loader，先把ts/tsx 转成 js/jsx，会使用tsconfig.json里面的配置，然后再用 babel-loader 去调用 babel 系列插件，编译成最终的 js
    rules: [
      //   {
      //     // 同时匹配js或者ts文件
      //     test: /\.(js|ts)$/,
      //     exclude: /node_modules/,
      //     use: [
      //       {
      //         loader: "babel-loader",
      //       },
      //     ],
      //   },

      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: ["babel-loader", { loader: "ts-loader" }], // 执行顺序从右到左
      },
    ],
  },
  mode: "production",
};
