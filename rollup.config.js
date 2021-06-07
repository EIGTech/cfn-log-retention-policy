import { lstatSync, readdirSync } from "fs";
import path from "path";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";

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
  plugins: [
    json(),
    commonjs({
      // non-CommonJS modules will be ignored, but you can also
      // specifically include/exclude files
      include: ["./dist/resource.js", "node_modules/**"], // Default: undefined

      // if true then uses of `global` won't be dealt with by this plugin
      ignoreGlobal: false, // Default: false

      // if false then skip sourceMap generation for CommonJS modules
      sourceMap: false, // Default: true
    }),
    nodeResolve({
      jsnext: true,
      main: false,
    }),
  ],
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
