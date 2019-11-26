const config = ({ base, title, description, dest, menu }) => ({
  typescript: true,
  base,
  title,
  description,
  dest: `../docs/${dest}`,
  ignore: ["README.md"],
  menu
});

export default config;
