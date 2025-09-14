import { getDefaultConfig } from 'expo/metro-config.js';

const config = getDefaultConfig(import.meta.url);

// Enable web support
config.resolver.platforms = ['ios', 'android', 'web'];

// Support for .jsx files
config.resolver.sourceExts.push('jsx');

export default config;
