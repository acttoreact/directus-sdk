require('dotenv').config();

module.exports = {
	preset: 'ts-jest',
	verbose: true,
	automock: false,
	setupFiles: ['dotenv/config', './setupJest.js'],
	collectCoverageFrom: ['src/**/*.ts'],
	testPathIgnorePatterns: ['dist'],
	testMatch: ['<rootDir>/tests/**/*.test.ts'],
	testEnvironmentOptions: {
		url: process.env.TEST_URL || 'http://localhost',
	},
};
