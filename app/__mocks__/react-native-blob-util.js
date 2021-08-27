const noop = () => ({});

export default {
  fetch: noop,
  base64: noop,
  android: noop,
  ios: noop,
  config: noop,
  session: noop,
  fs: {
    writeFile: () => Promise.resolve(),
    exists: () => Promise.resolve(),
    dirs: {
      CacheDir: noop,
    },
  },
  wrap: noop,
};
