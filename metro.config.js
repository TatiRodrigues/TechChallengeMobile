const { getDefaultConfig } = require('expo/metro-config');
const NativeWatcher =
  require('@expo/metro-file-map/build/watchers/NativeWatcher').default;

if (process.platform === 'win32') {
  NativeWatcher.isSupported = () => true;
}

const config = getDefaultConfig(__dirname);
const defaultBlockList = Array.isArray(config.resolver.blockList)
  ? config.resolver.blockList
  : [config.resolver.blockList].filter(Boolean);

config.resolver.blockList = [
  ...defaultBlockList,
  /^docs[\\/]node_modules(?:[\\/]|$)/,
];

module.exports = config;
