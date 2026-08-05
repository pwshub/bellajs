import { build, emptyDir } from "@deno/dnt";
import pkg from "../deno.json" with { type: "json" };

const outputDir = "./npm";

await emptyDir(outputDir);

await build({
  entryPoints: ["./mod.ts"],
  outDir: outputDir,
  shims: {
    deno: true,
  },
  test: false,
  tsconfig: {
    compilerOptions: {
      // lib: ["es2022", "dom", "dom.iterable"],
      lib: ["es2022"],
    },
  },
  package: {
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    author: pkg.author,
    repository: pkg.repository,
    bugs: {
      url: `${pkg.homepage}/issues`,
    },
    license: pkg.license,
  },
  postBuild() {
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
  filterDiagnostic(diag) {
    return !diag.file?.fileName?.includes("src/string.ts");
  },
});
