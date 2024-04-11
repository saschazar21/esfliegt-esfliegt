module.exports = {
  globDirectory: "build/client",
  globPatterns: ["**/*.{css,js,ico,svg,ttf,png,xml,jpg}"],
  swDest: "build/client/sw.js",
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
};
