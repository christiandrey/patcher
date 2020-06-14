module.exports = {
  roots: ['<rootDir>'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    // '^app(.*)$': '<rootDir>/src/app$1',
    // '^core(.*)$': '<rootDir>/src/core$1',
    // '^modules(.*)$': '<rootDir>/src/modules$1',
    // '^router(.*)$': '<rootDir>/src/router$1',
  },
  globals: {
    'ts-jest': {
      tsConfig: {
        target: 'es2019',
      },
    },
  },
};
