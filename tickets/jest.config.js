module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFilesAfterEnv: ['./src/test/setup.ts'],
    transform: {
        '^.+\\.(t|j)sx?$': '@swc/jest',
    },
    // globals: {
    //     'ts-jest': {
    //         isolatedModules: true,
    //     },
    // },
};
