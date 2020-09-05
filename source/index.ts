import { inspect } from "util";

console.log(inspect(Object.fromEntries([["hello", "world"]])));

throw new Error("Source map test :)")
