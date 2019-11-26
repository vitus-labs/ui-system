import rollup from "../../tools/rollup";

export default rollup({
  name: "vitus-labs-native-primitives",
  external: ["react"],
  globals: {
    react: "React"
  }
});
