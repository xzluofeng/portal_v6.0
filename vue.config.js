/*
 * @Date: 2022-03-22 16:37:19
 * @LastEditors: OBKoro1
 * @LastEditTime: 2022-03-24 16:11:04
 * @FilePath: \portal_v6.0\vue.config.js
 */
const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}

const projectName = "portal";

module.exports = {
  // 基本路径
  // baseUrl: process.env.NODE_ENV === "production" ? "./" : "/",
  publicPath: `/${projectName}/`, // 后期打包
  // publicPath: '/', // 路由的根路径
  // 输出文件目录
  outputDir: projectName,
  // eslint-loader 是否在保存的时候检查
  lintOnSave: process.env.NODE_ENV === "development",
  // assets打包到静态资源
  assetsDir: "static",
  // webpack配置
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  chainWebpack: (config) => {
    config.resolve.symlinks(true);
    config.resolve.alias
      .set("@", resolve("src"))
      .set("assets", resolve("src/assets"))
      .set("components", resolve("src/components"))
      .set("api", resolve("src/api"));
  },
  configureWebpack: () => {},
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,

  // use thread-loader for babel & TS in production build
  // enabled by default if the machine has more than 1 cores
  parallel: require("os").cpus().length > 1,
  // PWA 插件相关配置
  // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  pwa: {},
  // webpack-dev-server 相关配置
  devServer: {
    open: true, // 配置自动启动浏览器
    // host: 'localhost',
    port: 8762, // 端口号
    https: false,
    hot: true,
    hotOnly: false, // https:{type:Boolean}
    // disableHostCheck: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    proxy: {
      // 配置多个代理
      "/c": {
        target: "http://127.0.0.1:8762", // 代理到的地址，谷歌浏览器不会显示
        changeOrigin: true,
        // pathRewrite: {
        //   '^/c': ''
        // }
      },
      // '/d': {
      //   target: 'http://172.16.9.92:8201',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/d': ''
      //   }
      // },
    },
    // 是用于如果找不到界面就返回默认首页
    // 刷新页面时访问的资源在服务端找不到，
    // 因为vue-router设置的history路径不是真实存在的路径。
    // historyApiFallback: {
    //   rewrites: [
    //     {
    //       from: /^.*/,
    //       to: `/${projectName}/`
    //     }
    //   ]
    // }
  },

  // 第三方插件配置
  pluginOptions: {},
};
