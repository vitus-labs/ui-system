import rollup from "@vitus-labs/tools-rollup";

export default rollup({
  name: "vitus-labs-core",
  external: ["react", "styled-components"],
  globals: {
    react: "React",
    "styled-components": "styled"
  }
});
