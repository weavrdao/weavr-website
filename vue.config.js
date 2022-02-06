/* eslint-disable max-lines-per-function */
const path = require("path");

const globalSassFiles = [

]
module.exports = {
  publicPath: "./", 
  css: {
    requireModuleExtension: true,
    loaderOptions: {
      sass: {
        additionalData: globalSassFiles.map((src)=>'@import "' + src + '";').join('\n')
      }
    }
},
  chainWebpack: (config) => {
    config
      .plugin("html")
      .tap(args => {
        args[0].title = "The Frabric";
        return args;
      })

    const svgRule = config.module.rule("svg");
    svgRule.uses.clear();

    svgRule
      .use("file-loader")
      .loader("file-loader")
      .tap(options => {
        const newOptions = {
          symbolId: "[name][hash]",
          esModule: false
        };

        return { ...options, ...newOptions };
      })
      .end()

    config.module
      .rule("images")
      .use("url-loader")
      .loader("url-loader")
      .tap(
        options => Object.assign(options, {
          esModule: false
        })
      )
      .end()

    config.module
      .rule("vue")
      .use("vue-loader")
      .tap((options) => {
        const transformAssetUrls = options.transformAssetUrls || {}
        return {
          ...options,
          transformAssetUrls: {
            video: ["src", "poster"],
            source: "src",
            img: "src",
            image: "xlink:href",
            // ..others
            ...transformAssetUrls,
          },
        }
      })
      .end()

    // config.module
    //   .rule("sass")
    //   .test(/\.sass$/)
    //   .use("sass-loader")
    //   .loader("sass-loader")
    //   .loader("css-loader")
    //   .loader("style-loader")
    //   .tap((options) => {
        
    //     return {
    //       ...options,
    //       additionalData: `
    //         @import "@/bulma/bulma.sass"
    //       `
    //     }
    //   })
    //   .end()

  }
};

// module.exports = {
//   css: {
//     loaderOptions: {
//       sass: {
//         // additionalData: `@import "@/styles/variables.sass"`
//       }
//     }
//   },
// }