var plugins = [{
      plugin: require('/Users/wangyilin/per/Colafornia.github.io/node_modules/gatsby-plugin-react-helmet/gatsby-ssr'),
      options: {"plugins":[]},
    },{
      plugin: require('/Users/wangyilin/per/Colafornia.github.io/node_modules/gatsby-plugin-mdx/gatsby-ssr'),
      options: {"plugins":[{"resolve":"/Users/wangyilin/per/Colafornia.github.io/node_modules/gatsby-remark-katex","id":"430f4ef5-4515-527d-a0e7-5c31c20d218b","name":"gatsby-remark-katex","version":"3.1.13","pluginOptions":{"plugins":[]},"nodeAPIs":[],"browserAPIs":[],"ssrAPIs":[]},{"resolve":"/Users/wangyilin/per/Colafornia.github.io/node_modules/gatsby-remark-images","id":"95ba51d9-b8de-549d-ab03-dfbb835df344","name":"gatsby-remark-images","version":"3.1.26","pluginOptions":{"plugins":[],"maxWidth":1200,"linkImagesToOriginal":false,"withWebp":true},"nodeAPIs":[],"browserAPIs":["onRouteUpdate"],"ssrAPIs":["onRenderBody"]},{"resolve":"/Users/wangyilin/per/Colafornia.github.io/node_modules/gatsby-remark-prismjs","id":"4930366c-4e7b-5c6c-b213-cfc684fdedc3","name":"gatsby-remark-prismjs","version":"3.3.18","pluginOptions":{"plugins":[],"showLineNumbers":true,"aliases":{"sh":"bash"}},"nodeAPIs":[],"browserAPIs":[],"ssrAPIs":[]}],"extensions":[".md"],"remarkPlugins":[null],"gatsbyRemarkPlugins":["gatsby-remark-katex",{"resolve":"gatsby-remark-images","options":{"maxWidth":1200,"linkImagesToOriginal":false,"withWebp":true}},{"resolve":"gatsby-remark-prismjs","options":{"showLineNumbers":true,"aliases":{"sh":"bash"}}}]},
    },{
      plugin: require('/Users/wangyilin/per/Colafornia.github.io/node_modules/gatsby-remark-images/gatsby-ssr'),
      options: {"plugins":[],"maxWidth":1200,"linkImagesToOriginal":false,"withWebp":true},
    },{
      plugin: require('/Users/wangyilin/per/Colafornia.github.io/node_modules/gatsby-plugin-google-analytics/gatsby-ssr'),
      options: {"plugins":[],"trackingId":"UA-84469017-1"},
    },{
      plugin: require('/Users/wangyilin/per/Colafornia.github.io/node_modules/gatsby-plugin-html-attributes/gatsby-ssr'),
      options: {"plugins":[],"lang":"zh"},
    },{
      plugin: require('/Users/wangyilin/per/Colafornia.github.io/node_modules/gatsby-plugin-styled-components/gatsby-ssr'),
      options: {"plugins":[]},
    },{
      plugin: require('/Users/wangyilin/per/Colafornia.github.io/node_modules/gatsby-plugin-sitemap/gatsby-ssr'),
      options: {"plugins":[]},
    },{
      plugin: require('/Users/wangyilin/per/Colafornia.github.io/node_modules/gatsby-plugin-offline/gatsby-ssr'),
      options: {"plugins":[]},
    },{
      plugin: require('/Users/wangyilin/per/Colafornia.github.io/node_modules/gatsby-plugin-manifest/gatsby-ssr'),
      options: {"plugins":[],"name":"REXLNT","short_name":"REXLNT","start_url":"/","background_color":"#fff","theme_color":"#fff","display":"standalone","icon":"static/favicon.png"},
    }]
// During bootstrap, we write requires at top of this file which looks like:
// var plugins = [
//   {
//     plugin: require("/path/to/plugin1/gatsby-ssr.js"),
//     options: { ... },
//   },
//   {
//     plugin: require("/path/to/plugin2/gatsby-ssr.js"),
//     options: { ... },
//   },
// ]

const apis = require(`./api-ssr-docs`)

// Run the specified API in any plugins that have implemented it
module.exports = (api, args, defaultReturn, argTransform) => {
  if (!apis[api]) {
    console.log(`This API doesn't exist`, api)
  }

  // Run each plugin in series.
  // eslint-disable-next-line no-undef
  let results = plugins.map(plugin => {
    if (!plugin.plugin[api]) {
      return undefined
    }
    const result = plugin.plugin[api](args, plugin.options)
    if (result && argTransform) {
      args = argTransform({ args, result })
    }
    return result
  })

  // Filter out undefined results.
  results = results.filter(result => typeof result !== `undefined`)

  if (results.length > 0) {
    return results
  } else {
    return [defaultReturn]
  }
}
