module.exports = api => {
  api.cache(true);

  return {
    presets: [
      [
        "@babel/env",
        {
          useBuiltIns: "entry",
          targets: {
            node: "current",
            browsers: "Last 2 Chrome versions, Firefox ESR"
          }
        }
      ],
      "@babel/react"
    ],
    env: {
      build: {
        ignore: [
          "**/*.test.tsx",
          "**/*.test.ts",
          "**/*.story.tsx",
          "__snapshots__",
          "__tests__",
          "__stories__"
        ]
      }
    },
    ignore: ["node_modules"],
    plugins: [
      // [
      //   "module-resolver",
      //   {
      //     cwd: "babelrc",
      //     extensions: [".js"],
      //     alias: {
      //       "~": "./src"
      //     }
      //   }
      // ],
      "@babel/plugin-proposal-class-properties"
    ]
  };
};
