'use strict';

module.exports = {
  preset: '../../../jest-preset.unit.js',
  displayName: 'Core permissions',
  transform: { '^.+\\.ts$': ['@swc/jest'] },
  testMatch: ['<rootDir>/**/*.test.ts'],
};
