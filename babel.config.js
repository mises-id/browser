/*
 * @Author: lmk
 * @Date: 2021-07-05 10:09:07
 * @LastEditTime: 2021-08-14 18:34:37
 * @LastEditors: lmk
 * @Description:
 */
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        alias: {
          '@':'./app',
          '@images': './app/images',
          '@components': './app/components',
        },
      },
    ],
  ],
};
