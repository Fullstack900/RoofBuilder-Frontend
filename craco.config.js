const path = require('path')
const webpackTemplateConfig = require("./webpack-template.config");


module.exports = {
  reactScriptsVersion: 'react-scripts',
  style: {
    sass: {
      loaderOptions: {
        sassOptions: {
          includePaths: ['node_modules', 'src/assets']
        }
      }
    },
    postcss: {
      plugins: [require('postcss-rtl')()]
    }
  },
  webpack: {
    alias: {
      '@src': path.resolve(__dirname, 'src'),
      '@assets': path.resolve(__dirname, 'src/@core/assets'),
      '@components': path.resolve(__dirname, 'src/@core/components'),
      '@layouts': path.resolve(__dirname, 'src/@core/layouts'),
      '@store': path.resolve(__dirname, 'src/redux'),
      '@styles': path.resolve(__dirname, 'src/@core/scss'),
      '@configs': path.resolve(__dirname, 'src/configs'),
      '@utils': path.resolve(__dirname, 'src/utility/Utils'),
      '@hooks': path.resolve(__dirname, 'src/utility/hooks')
    }
  },
  overrideWebpackConfig: ({ webpackConfig, cracoConfig, pluginOptions, context: { env, paths } }) => {
    if (pluginOptions.preText) {
        console.log(pluginOptions.preText);
    }

    console.log(JSON.stringify(webpackConfig, null, 4));

    // Always return the config object.
    return webpackConfig;
  },
  /*
  plugins:[
    {plugin:webpackTemplateConfig, options: { preText: "Will log the webpack config:" }}
  ]
  */
  /*
  plugins:[
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin(
      Object.assign(
        {},
        {
          inject: true,
          template: 'public/index.aspx',

          // Here I added my defined variable name aspxPrefix that is located in my template to be replaced - <%= htmlWebpackPlugin.options.aspxPrefix %>

          aspxPrefix: '<%@ Page language="c#" CodeBehind="index_fw2.aspx.cs" AutoEventWireup="false" Inherits="IMod.Web.V2.Index" %>',

         // Then added the location and name I wanted the modified file to have here - in this case, I want it located in the build folder and renamed with .aspx

        filename:'build/index.aspx'
        }
      )
    )
      ]
  */
}
