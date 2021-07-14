module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        alias: {
          '@':'./app',
          '@images': './app/images',
          '@components': './app/components'
        },
      },
    ]
  ],
};
