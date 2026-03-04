module.exports = {
  testEnvironment: "node",
  testMatch: ["**/*.test.js"],
  clearMocks: true,
  moduleNameMapper: {
    "^node-fetch$": "<rootDir>/test/mocks/node-fetch.js",
  },
};
