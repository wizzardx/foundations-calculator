/**
 * @description This file exports basic arithmetic functions for addition and subtraction.
 * These functions are used in the calculator application.
 */

type NumericOperator = "plus" | "minus" | "divide" | "multiply";

declare global {
  // eslint-disable-next-line no-var
  var firstNumber: number | undefined;

  // eslint-disable-next-line no-var
  var operator: NumericOperator | undefined;

  // eslint-disable-next-line no-var
  var secondNumber: number | undefined;
}
globalThis.firstNumber = undefined;
globalThis.operator = undefined;
globalThis.secondNumber = undefined;

/**
 * Adds two numbers together.
 *
 * @param {number} a - The first number to add.
 * @param {number} b - The second number to add.
 * @returns {number} The sum of a and b.
 *
 * @example
 * ```ts
 * add(5, 3)
 * // => 8
 * ```
 */
export function add(a: number, b: number): number {
  return a + b;
}

/**
 * Subtracts one number from another.
 *
 * @param {number} a - The number to subtract from.
 * @param {number} b - The number to subtract.
 * @returns {number} The difference between a and b.
 *
 * @example
 * ```ts
 * subtract(10, 4)
 * // => 6
 * ```
 */
export function subtract(a: number, b: number): number {
  return a - b;
}

/**
 * Multiply one number by another.
 *
 * @param {number} a - The number to be multiplied.
 * @param {number} b - The number to be multiplied by.
 * @returns {number} - The product of a and b.
 *
 * @example
 * ```ts
 * multiply(5, 3)
 * // => 15
 * ```
 */
export function multiply(a: number, b: number): number {
  return a * b;
}

/**
 * Divide one number by another.
 *
 * @param {number} a - The number to be dvided.
 * @param {number} b - The number to be divided by.
 * @returns {number} - The result of dividing a by b.
 *
 * @example
 * ```ts
 * divide(99, 3)
 * // => 33
 * ```
 */
export function divide(a: number, b: number): number {
  return a / b;
}

/**
 * Assist with exhaustiveness checking in TypeScript code.
 *
 * @param {never} x - A value that should never be seen in the caller.
 *
 * @example
 * ```ts
 * assertUnreachable("abcdefg")
 * // => Throws Error: Unexpected object: abcdefg
 * ```
 */
// istanbul ignore next
export function assertUnreachable(x: never): never {
  throw new Error(`Unexpected object: ${x}`);
}

/**
 * Returns the function to be used for performing a specified numeric operation.
 *
 * @param {NumericOperator} op - Operator that we want a handler function for.
 * @returns {(a: number, b: number) => number} - Function to perform the operation.
 *
 * @example
 * ```ts
 * getOpFunc("minus")(10, 5)
 * // => 5
 * ```
 */
export function getOpFunc(
  op: NumericOperator,
): (a: number, b: number) => number {
  switch (op) {
    case "plus":
      return add;
    case "minus":
      return subtract;
    case "multiply":
      return multiply;
    case "divide":
      return divide;
    // istanbul ignore next
    default:
      return assertUnreachable(op);
  }
}

/**
 * Perform numeric operation against two numbers and return the result.
 *
 * @param {NumericOperator} op - Numeric operation to be performed.
 * @param {number} num1 - First number to use in the numeric operation.
 * @param {number} num2 - Second number to use in the numeric operation.
 * @returns {number} - Result of the numeric operation.
 * @example
 * ```ts
 * operatorFunc("plus", 1, 3)
 * // => 4
 * ```
 */
export function operatorFunc(
  op: NumericOperator,
  num1: number,
  num2: number,
): number {
  const opFunc: (a: number, b: number) => number = getOpFunc(op);
  return opFunc(num1, num2);
}

/**
 * Return true if `s` is an integer digit, otherwise false.
 * @param {unknown} s - The value to be checked.
 * @returns {boolean} - True if `s` was a digit, otherwise `false`.
 * @example
 * ```ts
 * isDigit("1")
 * // => true
 * ```
 */
export function isDigit(s: unknown): boolean {
  return typeof s === "string" && /^\d$/.test(s);
}
