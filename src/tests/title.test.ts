import assert from "assert";
import { formatFileName } from "../openai/image";

assert.strictEqual(formatFileName("Hello"), "hello.png");
assert.strictEqual(formatFileName("hello3-wo4^@rld9"), "hello3-wo4rld9.png");

console.log("title.test.ts: ", "PASS");
