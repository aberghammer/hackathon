module.exports = {
    testEnvironment: 'jsdom',
    moduleDirectories: [
      'node_modules',
  +   // add the directory with the test-utils.js file, for example:
  +   'utils', // a utility folder
  +    __dirname, // the root directory
    ],
  }