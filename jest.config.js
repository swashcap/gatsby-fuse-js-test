/**
 * @type {import("jest").Config}
 */
module.exports = {
  setupFilesAfterEnv: ["./jest.setup.js"],
  testEnvironment: "jsdom",
};
