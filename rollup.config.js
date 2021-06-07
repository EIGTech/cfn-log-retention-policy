import { lstatSync, readdirSync } from "fs";
import path from "path";

const recursiveReaddirSync = (filePath) => {
  var list = [],
    files = readdirSync(filePath),
    stats;

  files.forEach(function (file) {
    stats = lstatSync(path.join(filePath, file));
    if (stats.isDirectory()) {
      list = list.concat(recursiveReaddirSync(path.join(filePath, file)));
    } else {
      list.push(path.join(filePath, file));
    }
  });

  return list;
};

const getDefinition = (name) => ({
  input: name,
  output: {
    file: name.replace("dist", ".rollup"),
    format: "cjs",
  },
});

const entries = (source) =>
  recursiveReaddirSync(source)
    .filter((item) => /\.js$/.test(item))
    .filter(
      (item) =>
        !/\.d\.ts$|\/schemas\/|\/util\/|\/utils\/|\/validation\//.test(item)
    );

console.log(entries("dist"));

export default () => entries("dist").map(getDefinition);
