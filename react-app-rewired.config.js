const webpack = require('webpack');
module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        buffer: require.resolve('buffer'),
        stream: require.resolve('stream'),
      };
    }

    return config;
  },
};