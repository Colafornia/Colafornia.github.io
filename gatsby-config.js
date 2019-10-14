module.exports = {
  siteMetadata: {
      title: `Minibase`,
      siteUrl: `https://gatsby.colafornia.me`,
      description: `Colafornia's Personal Blog`,
      author: `Colafornia`,
      authorURL: `https://gatsby.colafornia.me`,
      socials: [
          {
              icon: 'github',
              name: 'GitHub',
              url: 'https://github.com/colafornia',
          },
      ]
  },
  plugins: [
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
    {
      resolve: `@pinggod/gatsby-theme-wink`,
      options: {
        // 文章所在目录
        postPath: "content/posts",
        mdxExtensions: [".md"],
        // google analytics ID
        ga: "UA-84469017-1",
        // 设置 HTML lang 属性
        htmlLang: "zh",
      }
    },
    // 设置 favicon 和 manifest
    // 文档地址：https://www.gatsbyjs.org/packages/gatsby-plugin-manifest/
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'Minibase',
        short_name: 'Minibase',
        start_url: `/`,
        background_color: `#fff`,
        theme_color: `#fff`,
        display: `standalone`,
        icon: "static/favicon.png",
      },
    }
  ],
}
