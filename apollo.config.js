module.exports = {
  client: {
    service: {
      name: "frabric-app",
      // URL to the GraphQL API
      url: "https://api.studio.thegraph.com/query/33686/tonyweavrdao/v0.0.1",
    },
    // Files processed by the extension
    includes: [
      "src/**/*.vue",
      "src/**/*.js",
    ],
  },
}