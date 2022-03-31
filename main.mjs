import fs from "fs";
import * as sass from "node-sass";
import { green, underline } from "colorette";
import * as path from "path";

function change_ext(file, ext) {
    return path.format({ ...path.parse(file), base: "", ext: `.${ext}` });
}

export function scss(files, name) {
    return {
        name: "bundle-scss",
        async buildStart() {
            for (let file of files) {
                this.addWatchFile(file);
            }
        },
        async generateBundle() {
            const dir = `${__dirname}/view/static/css`;

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
