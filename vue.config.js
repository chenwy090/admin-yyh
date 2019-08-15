module.exports = {
  // baseUrl: '/zex-mgr',
  outputDir: 'zex-mgr', // 输出文件目录
  devServer: {
    port: 9999, // 端口号
    host: '127.0.0.1',
    https: false, // https:{type:Boolean}
    open: true, // 配置自动启动浏览器
    proxy: null,
    proxy: {
      '/zex-mgr': {
        //   target: 'http://pre-release.sweetmartmarketing.com:8088',
        target: 'http://localhost:8088',
        //  target: 'http://192.168.2.234:8088',
        ws: true,
        changeOrigin: true
      },
      '/foo': {
        target: '<other_url>'
      }
    }

  },

  productionSourceMap: false, // 生产环境是否生成 sourceMap 文件，一般情况不建议打开

  //     configureWebpack: {
  //         externals: {
  //             vue: "Vue",
  //             vuex: "Vuex",
  //             "vue-router": "VueRouter",
  //             iview:"iview"

  //       }
  //  }
}


// 打包时 修改线上地址 src/api/index.js
//
