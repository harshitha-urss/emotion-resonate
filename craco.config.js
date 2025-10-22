// craco.config.js
module.exports = {
  webpack: {
    resolve: {
      fallback: {
        "crypto": require.resolve("crypto-browserify"),
        "fs": false
      }
    }
  }
};
