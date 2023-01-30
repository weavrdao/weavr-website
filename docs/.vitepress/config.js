export default {
  title: "WeavBlog",
  description: "Where to find all of your Weavr news and content",
  head: [
    ["link", {rel: "icon", type: "image/x-con", href: "/favicon.ico"}],
  ],
  themeConfig: {
    nav: [
      {text: "Home", link: "/"},
      {text: "Weavr", link: "https://weavr.org"},
      {text: "Forums", link: "https://forum.weavr.org"},
      {text: "GitHub", link: "https://github.com/weavrdao"}
    ],
    logo: "/logo.svg",
  },
  lastUpdated: true
}