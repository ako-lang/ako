module.exports = {
    testEnvironment: 'node',
    transformIgnorePatterns: [
        '<rootDir>/node_modules/',
        '<rootDir>/dist/'
    ],
    transform: {
        "^.+\\.ts$": "esbuild-jest-transform"
    }
};