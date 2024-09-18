// @ts-check
const { createDefaultPreset, pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig.app.json");

/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  testEnvironment: "node",
  ...createDefaultPreset({
    tsconfig: "./tsconfig.app.json",
    isolatedModules: true,
  }),
  coverageDirectory: "./coverage",
  coverageReporters: ["html"],
  roots: ["<rootDir>"],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
};

module.exports = config;
