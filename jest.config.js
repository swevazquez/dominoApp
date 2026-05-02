module.exports = {
  testEnvironment: "node",
  watchman: false,
  testMatch: ["**/tests/**/*.test.ts", "**/tests/**/*.test.tsx"],
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "babel-jest"
  },
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|react-native-view-shot)/)"
  ],
  moduleNameMapper: {
    "^@app/(.*)$": "<rootDir>/app/$1",
    "^@data/(.*)$": "<rootDir>/data/$1",
    "^@domain/(.*)$": "<rootDir>/domain/$1",
    "^@features/(.*)$": "<rootDir>/features/$1"
  }
};
