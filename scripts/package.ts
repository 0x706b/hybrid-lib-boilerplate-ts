import * as IO from "fp-ts/lib/IO";
import * as Path from "path";
import * as T from "fp-ts/lib/Task";
import * as TE from "fp-ts/lib/TaskEither";
import * as fs from "fs";
import { log } from "fp-ts/lib/Console";
import { parseJSON } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";

const readFile = TE.taskify<fs.PathLike, string, NodeJS.ErrnoException, string>(fs.readFile);

const writeFile = TE.taskify<fs.PathLike, string, NodeJS.ErrnoException, void>(fs.writeFile);

const exit = (code: 0 | 1): IO.IO<void> => () => process.exit(code);

pipe(
   readFile(Path.resolve(process.cwd(), "package.json"), "utf8"),
   TE.chain((content) =>
      TE.fromEither(
         parseJSON(content, (err) => new Error(`json parse error: ${(err as Error).message}`))
      )
   ),
   TE.chain((content: any) =>
      writeFile(
         Path.resolve(process.cwd(), "dist/package.json"),
         JSON.stringify({
            author: content["author"],
            dependencies: content["dependencies"],
            description: content["description"],
            exports: {
               ".": {
                  import: "./index.js",
                  require: "./commonjs/index.js"
               },
               "./": {
                  import: "./",
                  require: "./commonjs/"
               }
            },
            license: content["license"],
            main: "./index.js",
            name: content["name"],
            peerDependencies: content["peerDependencies"],
            private: false,
            publishConfig: {
               access: "public"
            },
            repository: content["repository"],
            type: "module",
            typings: "./index.d.ts",
            version: content["version"]
         })
      )
   ),
   TE.chain(() =>
      writeFile(
         Path.resolve(process.cwd(), "dist/commonjs/package.json"),
         JSON.stringify({
            type: "commonjs"
         })
      )
   ),
   TE.fold(
      (err) =>
         T.fromIO(
            pipe(
               log(err),
               IO.chain(() => exit(1))
            )
         ),
      () => T.fromIO(log("package copy succeeded!"))
   )
)().catch((e) => console.log(`unexpected error ${e}`));
