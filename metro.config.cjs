const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable web support
config.resolver.platforms = ['ios', 'android', 'web'];

// Support for .jsx files
config.resolver.sourceExts.push('jsx');

module.exports = config;
