import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },

  // Coverage
  collectCoverage: true,
};

export default config;
