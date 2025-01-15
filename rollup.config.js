import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import dts from "rollup-plugin-dts";
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { readFileSync } from "fs";

const pkg = JSON.parse(readFileSync("package.json"));

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.js",
        format: "cjs",
        sourcemap: true,
      },
      {
        file: "dist/index.esm.js",
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
      postcss({
        plugins: [
          tailwindcss,
          autoprefixer,
        ],
        extensions: [".css"],
        extract: "index.css",
        modules: false,
        minimize: true,
      }),
    ],
    external: ["react", "react-dom"],
  },
  {
    input: "src/index.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
      /\.css$/
    ],
    plugins: [
      dts({
        respectExternal: true,
        compilerOptions: {
          baseUrl: ".",
          paths: {
            "@/*": ["src/*"],
            "@/components/*": ["src/components/*"]
          }
        }
      })
    ],
  },
];
