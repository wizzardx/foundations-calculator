/**
 * @description This file exports basic arithmetic functions for addition and subtraction.
 * These functions are used in the calculator application.
 */

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
