const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    overrideWebpackConfig: ({ webpackConfig, cracoConfig, pluginOptions, context: { env, paths } }) => {
        if (pluginOptions.preText) {
            console.log(pluginOptions.preText);
        }
        console.log(paths)
        webpackConfig.plugins.push(

            new HtmlWebpackPlugin(
                Object.assign(
                  {},
                  {
                    inject: true,
                    template: `${paths.appPublic}/index2.html`,
          
                    // Here I added my defined variable name aspxPrefix that is located in my template to be replaced - <%= htmlWebpackPlugin.options.aspxPrefix %>
          
                    aspxPrefix: '<%@ Page language="c#" CodeBehind="index_fw2.aspx.cs" AutoEventWireup="false" Inherits="IMod.Web.V2.Index" %>',
          
                   // Then added the location and name I wanted the modified file to have here - in this case, I want it located in the build folder and renamed with .aspx
          
                    filename: `${paths.appBuild}/index.aspx`
                  }
                )
              )
                

        )

        console.log(JSON.stringify(webpackConfig, null, 4));

        // Always return the config object.
        return webpackConfig;
    }
};