// vue-cli配置文件
const path = require("path");

//获取打包时的时间戳
const Timestamp = new Date().getTime();

function resolve(dir) {
  return path.join(__dirname, dir);
}

const BASE_URL = process.env.NODE_ENV === "production" ? "/" : "/";

module.exports = {
  // 项目部署的基础路径
  publicPath: BASE_URL,

  // 将构建好的文件输出到哪里
  outputDir: "dist",

  //代码错误提示，生产环境设置为false
  productionSourceMap: false,

  //是否在保存的时候使用 `eslint-loader` 进行检查
  lintOnSave: false,

  // 配置 webpack-dev-server 行为。
  devServer: {
    open: true,
    host: "0.0.0.0",
    port: 8045,
    https: false,
    hotOnly: false,
    open: true,
    // 开发环境代理配置，string | Object
    proxy: {
      "/api": {
        // target: "http://47.114.151.82:8092/api", // 测试的地址2
        target: "http://127.0.0.1:8076/api",
        // target: "https://api.ybmblex.net/api", // 正式的地址2
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },

    before: (app) => {},
  },

  // 调整内部的 webpack 配置...(链式写法)
  chainWebpack: (config) => {
    config
      .plugin("webpack-bundle-analyzer")
      .use(require("webpack-bundle-analyzer").BundleAnalyzerPlugin, [
        {
          analyzerPort: 8889,
        },
      ]);

    config.resolve.alias
      .set("@comp", resolve("src/components"))
      .set("@assets", resolve("src/assets"))
      .set("@utils", resolve("src/utils"))
      .set("@router", resolve("src/router"))
      .set("@views", resolve("src/views"))
      .set("@api", resolve("src/api"))
      .set("@config", resolve("src/config.js"));

    // 为css文件打包时加上反缀
    // config.plugin('extract-css').tap(args => [{
    //     filename: `css/[name].${Timestamp}.css`,
    //     chunkFilename: `css/[name].${Timestamp}.css`
    // }])
  },

  // 调整内部的 webpack 配置...(常规写法)
  configureWebpack: {
    resolve: {
      alias: {
        vue$: "vue/dist/vue.esm.js",
      },
    },

    // 为js文件打包时加上反缀
    // output: {
    //   filename: `js/[name].${Timestamp}.js`,
    //   chunkFilename: `js/[name].${Timestamp}.js`,
    // },

    // externals: {
    //   tinymce: "tinymce",
    //   echarts: "echarts",
    //   "tinymce/tinymce-vue": "tinymce/tinymce-vue",
    //   "moment-timezone": "moment-timezone",
    //   "element-ui": "element-ui",
    // },

    optimization: {
      splitChunks: {
        chunks: "all", // 对同步和异步加载的chunks都进行分割
        minSize: 30000, // 最小尺寸，默认0
        minChunks: 1, // 最小 chunk 数，默认1
        maxAsyncRequests: 30, // 按需加载时的最大并行请求数
        maxInitialRequests: 30, // 入口点的最大并行请求数
        automaticNameDelimiter: "~", // 生成的 chunk 文件名的连接符
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // 获取模块名。例如：node_modules/packageName/not/this/part.js
              // 或者 npm package name
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1];
              // npm package name mapped to cache group
              return `npm.${packageName.replace("@", "")}`;
            },
          },
          // 其他自定义的缓存组...
        },
      },
    },
  },
};
