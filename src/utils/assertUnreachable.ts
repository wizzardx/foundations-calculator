/**
 * @file This file contains the assertUnreachable function, which is used for exhaustiveness checking in TypeScript code.
 * @description The assertUnreachable function is a utility used to ensure that all cases in a switch statement or similar construct are handled. It's designed to be unreachable in properly typed code and throws an error if called.
 */

/**
 * Assist with exhaustiveness checking in TypeScript code.
 *
 * @param {never} x - A value that should never be seen in the caller.
 * @throws {Error} Always throws an error with a message including the unexpected value.
 * @example
 * assertUnreachable("abcdefg")
 * // => Throws Error: Unexpected object: abcdefg
 */
export function assertUnreachable(x: never): never {
  throw new Error(`Unexpected object: ${x}`);
}
