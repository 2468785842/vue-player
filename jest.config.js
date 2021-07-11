module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  moduleNameMapper: {
    "^@services$": "<rootDir>/src/api/services",
    "^@services/(.*)$": "<rootDir>/src/api/services/$1",
    "^@api/(.*)$": "<rootDir>/src/api/$1",
    "^@common/(.*)$": "<rootDir>/src/common/$1",
    "^@model/(.*)$": "<rootDir>/src/model/$1",
    "^@utils/(.*)$": "<rootDir>/src/utils/$1"
  }
};
