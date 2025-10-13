module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // ⚠️ Giữ plugin này ở cuối cùng
      "react-native-reanimated/plugin",
    ],
  };
};
