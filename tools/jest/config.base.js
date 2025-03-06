module.exports = {
    moduleFileExtensions: [ 'js' ],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1'
      },
    collectCoverage: false,
    verbose: true,
    testPathIgnorePatterns: ['\\.spec\\.js$']
};