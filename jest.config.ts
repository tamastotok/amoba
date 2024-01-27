module.exports = {
  // The test environment that will be used for testing
  testEnvironment: 'jsdom',

  // The pattern or array of patterns Jest uses to detect test files
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',

  // Indicates whether each individual test should be reported during the run
  verbose: true,

  // The file extensions Jest will look for
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],

  // The directories Jest will look for modules in
  moduleDirectories: ['node_modules', 'src'],

  // Additional options for the resolver
  resolver: 'jest-resolver-tsconfig-paths',

  // Configuration options for coverage reporting
  coverageReporters: ['json', 'lcov', 'text', 'clover'],

  // Configure React Testing Library to log debug output
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
};
