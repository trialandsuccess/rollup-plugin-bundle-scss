import fs from "fs";
import * as sass from "node-sass";
import { green, underline } from "colorette";
import * as path from "path";

import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log(
    __filename,
    __dirname,
)

function change_ext(file, ext) {
    return path.format({ ...path.parse(file), base: "", ext: `.${ext}` });
}

export function scss(files, name, dir) {
    return {
        name: "bundle-scss",
        async buildStart() {
            for (let file of files) {
                this.addWatchFile(file);
            }
        },
        async generateBundle() {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }

            // hacky way to combine scss files:
            const imports = files.map((f) => `@import "${f}";`).join("\n");

            sass.render(
                {
                    data: imports,

                    outputStyle: process.env.BUILD === "production" ? "compressed" : "expanded",
                    // includePaths: "./node_modules",
                    indentType: "spaces",
                    indentWidth: 4,
                },
                (_, css) => {
                    const out_name = change_ext(name, "css");

                    fs.writeFileSync(`${dir}/${out_name}`, css.css);

                    console.log(green(underline(out_name)), green("compiled succesfully."));
                }
            );
        },
    };
}
