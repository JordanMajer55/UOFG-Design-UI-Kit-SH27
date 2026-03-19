module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  clearMocks: true,
  moduleNameMapper: {
    '^node-fetch$': '<rootDir>/test/mocks/node-fetch.js',
  },
};
