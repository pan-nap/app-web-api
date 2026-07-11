export default {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  moduleNameMapper: {
    '^#config/(.*)$': '<rootDir>/src/config/$1',
    '^#controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^#middleware/(.*)$': '<rootDir>/src/middleware/$1',
    '^#routes/(.*)$': '<rootDir>/src/routes/$1',
    '^#utils/(.*)$': '<rootDir>/src/utils/$1'
  },
  verbose: true,
  transform: {},
  globals: {
    'NODE_ENV': 'test'
  }
}
