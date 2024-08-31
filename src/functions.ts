/**
 * @description This file exports basic arithmetic functions for addition and subtraction.
 * These functions are used in the calculator application.
 */
import Big from "big.js";

import { assertUnreachable } from "./utils/assertUnreachable";

const operators: readonly ["+", "-", "/", "*"] = ["+", "-", "/", "*"] as const;
export type Operator = (typeof operators)[number];

export const MAX_DECIMAL_PLACES_IN_DISPLAY: number = 5;

/**
 * Adds two numbers together.
 *
 * @param {Big | "Infinity"} a - The first number to add.
 * @param {Big} b - The second number to add.
 * @returns {Big | "Infinity"} The sum of a and b.
 * @example
 * ```ts @import.meta.vitest
 * expect(add(Big(5), Big(3))).toStrictEqual(Big(8))
 * expect(add("Infinity", Big(3))).toBe("Infinity")
 * ```
 */
export function add(a: Big | "Infinity", b: Big): Big | "Infinity" {
  if (a === "Infinity") {
    return "Infinity";
  }
  return a.add(b);
}

/**
 * Subtracts one number from another.
 *
 * @param {Big | "Infinity"} a - The number to subtract from.
 * @param {Big} b - The number to subtract.
 * @returns {Big | "Infinity"} The difference between a and b.
 * @example
 * ```ts @import.meta.vitest
 * expect(subtract(Big(10), Big(4))).toStrictEqual(Big(6))
 * expect(subtract("Infinity", Big(5))).toBe("Infinity")
 * ```
 */
export function subtract(a: Big | "Infinity", b: Big): Big | "Infinity" {
  if (a === "Infinity") {
    return "Infinity";
  }
  return a.sub(b);
}

/**
 * Multiply one number by another.
 *
 * @param {Big | "Infinity"} a - The number to be multiplied.
 * @param {Big} b - The number to be multiplied by.
 * @returns {Big | "Infinity"} The product of a and b.
 * @example
 * ```ts @import.meta.vitest
 * expect(multiply(Big(3), Big(4))).toStrictEqual(Big(12))
 * expect(multiply("Infinity", Big(2))).toBe("Infinity")
 * ```
 */
export function multiply(a: Big | "Infinity", b: Big): Big | "Infinity" {
  if (a === "Infinity") {
    return "Infinity";
  }
  return a.mul(b);
}

/**
 * Divide one number by another.
 *
 * @param {Big | "Infinity"} a - The number to be divided.
 * @param {Big} b - The number to be divided by.
 * @returns {Big | "Infinity"} The result of dividing a by b.
 * @example
 * ```ts @import.meta.vitest
 * expect(divide(Big(12), Big(3))).toStrictEqual(Big(4))
 * expect(divide("Infinity", Big(2))).toBe("Infinity")
 * ```
 */
export function divide(a: Big | "Infinity", b: Big): Big | "Infinity" {
  if (a === "Infinity") {
    return "Infinity";
  }
  return a.div(b);
}

/**
 * Returns the function to be used for performing a specified numeric operation.
 *
 * @param {Operator} op - Operator that we want a handler function for.
 * @returns {(a: Big | "Infinity", b: Big) => Big | "Infinity"} Function to perform the operation.
 * @example
 * ```ts @import.meta.vitest
 * const addFunc = getOpFunc("+")
 * expect(addFunc(Big(3), Big(4))).toStrictEqual(Big(7))

 * ```
 */
export function getOpFunc(
  op: Operator,
): (a: Big | "Infinity", b: Big) => Big | "Infinity" {
  switch (op) {
    case "+":
      return add;
    case "-":
      return subtract;
    case "*":
      return multiply;
    case "/":
      return divide;
    /* v8 ignore next */
    default:
      /* v8 ignore next */
      return assertUnreachable(op);
  }
}

/**
 * Perform numeric operation against two numbers and return the result.
 *
 * @param {Operator} op - Numeric operation to be performed.
 * @param {Big | "Infinity"} num1 - First number to use in the numeric operation.
 * @param {Big} num2 - Second number to use in the numeric operation.
 * @returns {Big | "Infinity"} Result of the numeric operation.
 * @example
 * ```ts @import.meta.vitest
 * expect(operatorFunc("+", Big(5), Big(3))).toStrictEqual(Big(8))
 * expect(operatorFunc("*", "Infinity", Big(2))).toBe("Infinity")
 * ```
 */ export function operatorFunc(
  op: Operator,
  num1: Big | "Infinity",
  num2: Big,
): Big | "Infinity" {
  const opFunc: (a: Big | "Infinity", b: Big) => Big | "Infinity" =
    getOpFunc(op);
  return opFunc(num1, num2);
}

/**
 * Parse a string into a valid Operator.
 *
 * @param {unknown} s - The string to parse.
 * @returns {Operator} The parsed Operator.
 * @throws {Error} If the input is not a valid Operator.
 * @example
 * ```ts @import.meta.vitest
 * expect(parseOperator("+")).toBe("+")
 * expect(() => parseOperator("x")).toThrow("Invalid operator: x")
 * ```
 */
export function parseOperator(s: unknown): Operator {
  if (typeof s !== "string") {
    throw new Error(`Expected string, got ${typeof s}`);
  }

  if (s.length !== 1 || !isOperator(s)) {
    throw new Error(`Invalid operator: ${s}`);
  }

  return s;
}

/**
 * Check if a string is a valid Operator.
 *
 * @param {string} s - The string to check.
 * @returns {boolean} True if the string is a valid Operator, false otherwise.
 * @example
 * ```ts @import.meta.vitest
 * expect(isOperator("+")).toBe(true)
 * expect(isOperator("x")).toBe(false)
 * ```
 */
function isOperator(s: string): s is Operator {
  return operators.includes(s as Operator);
}

/**
 * Return true if `s` is an integer digit, otherwise false.
 * @param {unknown} s - The value to be checked.
 * @returns {boolean} - True if `s` was a digit, otherwise `false`.
 * @example
 * ```ts @import.meta.vitest
 * expect(isDigit("1")).toBe(true)
 * expect(isDigit("a")).toBe(false)
 * ```
 */
export function isDigit(s: unknown): boolean {
  return typeof s === "string" && /^\d$/.test(s);
}

/**
 * Assert that a value is a single-digit integer (0-9).
 *
 * @param {unknown} num - The value to check.
 * @throws {Error} If the value is not a single-digit integer.
 * @example
 * ```ts @import.meta.vitest
 * expect(() => assertIsSingleDigitNumber(5)).not.toThrow()
 * expect(() => assertIsSingleDigitNumber(10)).toThrow("Value 10 is not a single digit integer")
 * ```
 */
export function assertIsSingleDigitNumber(num: unknown): asserts num is number {
  if (typeof num !== "number" || !Number.isInteger(num) || num < 0 || num > 9) {
    throw new Error(`Value ${num} is not a single digit integer`);
  }
}

/**
 * Assert that a value is not null.
 *
 * @param {unknown} x - The value to check.
 * @throws {Error} If the value is null.
 * @example
 * ```ts @import.meta.vitest
 * expect(() => assertIsNotNull(5)).not.toThrow()
 * expect(() => assertIsNotNull(null)).toThrow("Value is null")
 * ```
 */
export function assertIsNotNull(
  x: unknown,
): asserts x is NonNullable<typeof x> {
  if (x === null) {
    throw new Error("Value is null");
  }
}

/**
 * Placeholder function for not yet implemented features.
 *
 * @throws {Error} Always throws an error indicating the feature is not implemented.
 * @example
 * ```ts @import.meta.vitest
 * expect(() => notImplemented()).toThrow("Not yet implemented")
 * ```
 */
export function notImplemented(): never {
  throw new Error("Not yet implemented");
}

/**
 * Convert a decimal place to its corresponding multiplier.
 *
 * @param {number} decimalPlace - The decimal place to convert.
 * @returns {Big} The multiplier for the given decimal place.
 * @throws {Error} If the input is not a positive integer.
 * @example
 * ```ts @import.meta.vitest
 * expect(decimalPlaceToMultiplier(2)).toStrictEqual(Big(0.01))
 * expect(() => decimalPlaceToMultiplier(0)).toThrow("Decimal place must be a positive integer")
 * ```
 */
export function decimalPlaceToMultiplier(decimalPlace: number): Big {
  if (decimalPlace < 1 || !Number.isInteger(decimalPlace)) {
    throw new Error("Decimal place must be a positive integer");
  }
  return Big(10).pow(-decimalPlace);
}

/**
 * Represents a basic calculator with arithmetic operations.
 *
 * @example
 * ```ts @import.meta.vitest
 * const calc = new Calculator()
 * calc.pressNumberButton(5)
 * expect(calc.getCurrentInputNumber()).toStrictEqual(Big(5))
 * ```
 */
export class Calculator {
  accumulator: Big | "Infinity" | null = null;
  // State relating to the current input number:
  currentInputNumber: Big | null = null;
  decimalButtonPressed: boolean = false;
  // Map of special key handlers
  keyHandlers: { [key: string]: () => void } = {
    /**
     * Handles the decimal point key press.
     *
     * @returns {void}
     */
    ".": (): void => this.pressDecimalButton(),

    /**
     * Handles the equals key press.
     *
     * @returns {void}
     */
    "=": (): void => this.pressEqualsButton(),

    /**
     * Handles the Backspace key press.
     *
     * @returns {void}
     */
    Backspace: (): void => this.pressBackspaceButton(),

    /**
     * Handles the Enter key press.
     *
     * @returns {void}
     */
    Enter: (): void => this.pressEqualsButton(),
  };
  nextDecimalPlace: number | null = null;
  nextOperator: Operator | null = null;

  /**
   * Apply the current operator to the accumulator and current input number.
   *
   * @param {Operator | null} currentOperator - The current operator to apply.
   * @private
   */
  private applyCurrentOperator(currentOperator: Operator | null): void {
    if (
      currentOperator === null ||
      this.currentInputNumber === null ||
      this.accumulator === null
    ) {
      return;
    }
    this.accumulator = operatorFunc(
      currentOperator,
      this.accumulator,
      this.currentInputNumber,
    );
  }
  /**
   * Apply the pending operation to the accumulator and current input number.
   *
   * @private
   */
  private applyPendingOperation(): void {
    if (
      this.nextOperator === null ||
      this.accumulator === null ||
      this.currentInputNumber === null
    ) {
      return;
    }

    this.accumulator = this.calculateResult(
      this.nextOperator,
      this.accumulator,
      this.currentInputNumber,
    );
  }
  /**
   * Calculates the result of an operation between two numbers.
   *
   * @param {Operator} op - The operator to use for the calculation.
   * @param {Big | "Infinity"} acc - The accumulator value.
   * @param {Big} input - The input value.
   * @returns {Big | "Infinity"} The result of the calculation.
   */
  private calculateResult(
    op: Operator,
    acc: Big | "Infinity",
    input: Big,
  ): Big | "Infinity" {
    if (op === "/" && input.eq(0)) {
      return "Infinity"; // Handle division by zero
    }
    return operatorFunc(op, acc, input);
  }
  /**
   * Get the current value of the accumulator.
   *
   * @returns {Big | "Infinity" | null} The current accumulator value.
   * @example
   * ```ts @import.meta.vitest
   * const calc = new Calculator()
   * expect(calc.getAccumulator()).toBeNull()
   * ```
   */
  public getAccumulator(): Big | "Infinity" | null {
    return this.accumulator;
  }

  /**
   * Get the current input number.
   *
   * @returns {Big | null} The current input number or null if not set.
   * @example
   * ```ts @import.meta.vitest
   * const calc = new Calculator()
   * expect(calc.getCurrentInputNumber()).toBeNull()
   * ```
   */
  public getCurrentInputNumber(): Big | null {
    return this.currentInputNumber;
  }
  /**
   * Gets the current state of the decimal button.
   * @returns {boolean} True if the decimal button is pressed, false otherwise.
   * @example
   * ```ts @import.meta.vitest
   * const calc = new Calculator()
   * expect(calc.getDecimalButtonPressed()).toBe(false)
   * calc.pressDecimalButton()
   * expect(calc.getDecimalButtonPressed()).toBe(true)
   * ```
   */
  public getDecimalButtonPressed(): boolean {
    return this.decimalButtonPressed;
  }
  /**
   * Gets the current display string of the calculator.
   * @returns {string} The current display string.
   * @example
   * ```ts @import.meta.vitest
   * const calc = new Calculator()
   * calc.pressNumberButton(1)
   * calc.pressNumberButton(2)
   * calc.pressNumberButton(3)
   * expect(calc.getDisplayString()).toBe("123")
   * ```
   */
  public getDisplayString(): string {
    if (this.currentInputNumber !== null) {
      return this.currentInputNumber.toString();
    }
    if (this.nextOperator !== null) {
      return this.nextOperator;
    }
    if (this.accumulator !== null) {
      if (this.accumulator === "Infinity") {
        // Return a snarky message for division by zero.
        return "No division by zero is allowed, you silly goose!";
      }
      return this.accumulator.round(MAX_DECIMAL_PLACES_IN_DISPLAY).toString();
    }
    return "0";
  }
  /**
   * Gets the next decimal place to be used.
   * @returns {number | null} The next decimal place or null if not set.
   * @example
   * ```ts @import.meta.vitest
   * const calc = new Calculator()
   * expect(calc.getNextDecimalPlace()).toBeNull()
   * calc.pressDecimalButton()
   * expect(calc.getNextDecimalPlace()).toBe(1)
   * ```
   */
  public getNextDecimalPlace(): number | null {
    return this.nextDecimalPlace;
  }
  /**
   * Get the next operator to be applied.
   *
   * @returns {Operator | null} The next operator or null if it isn't set.
   * @example
   * ```ts @import.meta.vitest
   * const calc = new Calculator()
   * expect(calc.getNextOperator()).toBeNull()
   * ```
   */
  public getNextOperator(): Operator | null {
    return this.nextOperator;
  }

  /**
   * Handles backspace operation for decimal numbers.
   *
   * @private
   */
  private handleDecimalBackspace(): void {
    assertIsNotNull(this.nextDecimalPlace);

    if (this.nextDecimalPlace < 1) {
      throw new Error(
        `Next decimal place should not be ${this.nextDecimalPlace}`,
      );
    }

    if (this.nextDecimalPlace > 1) {
      this.removeLastDecimalPlace();
    } else if (this.nextDecimalPlace === 1) {
      this.removeDecimalPoint();
    } else {
      throw new Error(
        `Next decimal place should not be ${this.nextDecimalPlace}`,
      );
    }
  }
  /**
   * Handles UI button presses on the calculator.
   * @param {string} s - The button pressed.
   * @throws {Error} If an invalid button is pressed.
   * @example
   * ```ts @import.meta.vitest
   * const calc = new Calculator()
   * calc.handleUiButtonPressed("1")
   * calc.handleUiButtonPressed("+")
   * calc.handleUiButtonPressed("2")
   * calc.handleUiButtonPressed("=")
   * expect(calc.getAccumulator()).toStrictEqual(Big(3))
   * ```
   */
  public handleUiButtonPressed(s: string): void {
    if (isDigit(s)) {
      this.pressNumberButton(Number(s));
    } else if (isOperator(s)) {
      this.pressOperatorButton(s);
    } else if (s === "Clear") {
      this.pressClearButton();
    } else if (s === "=") {
      this.pressEqualsButton();
    } else {
      throw new Error(`Invalid button: ${s}`);
    }
  }
  /**
   * Handles backspace operation for whole numbers.
   *
   * @private
   */
  private handleWholeNumberBackspace(): void {
    this.currentInputNumber = this.currentInputNumber!.div(10).round(0, 0);
  }
  /**
   * Simulates pressing the backspace button on the calculator.
   * @example
   * ```ts @import.meta.vitest
   * const calc = new Calculator()
   * calc.pressNumberButton(1)
   * calc.pressNumberButton(2)
   * calc.pressBackspaceButton()
   * expect(calc.getCurrentInputNumber()).toStrictEqual(Big(1))
   * ```
   */
  public pressBackspaceButton(): void {
    if (this.currentInputNumber === null) {
      return; // Nothing to backspace if there's no current input
    }

    if (this.decimalButtonPressed) {
      this.handleDecimalBackspace();
    } else {
      this.handleWholeNumberBackspace();
    }
  }
  /**
   * Simulates pressing the clear button on the calculator.
   * @example
   * ```ts @import.meta.vitest
   * const calc = new Calculator()
   * calc.pressNumberButton(5)
   * calc.pressClearButton()
   * expect(calc.getAccumulator()).toBeNull()
   * expect(calc.getCurrentInputNumber()).toBeNull()
   * ```
   */
  public pressClearButton(): void {
    this.accumulator = null;
    this.nextOperator = null;
    this.resetInputNumberState();
  }
  /**
   * Simulates pressing the decimal button on the calculator.
   * @example
   * ```ts @import.meta.vitest
   * const calc = new Calculator()
   * calc.pressDecimalButton()
   * expect(calc.getDecimalButtonPressed()).toBe(true)
   * ```
   */
  public pressDecimalButton(): void {
    if (!this.decimalButtonPressed) {
      this.decimalButtonPressed = true;
      this.nextDecimalPlace = 1;
    }
  }

  /**
   * Simulates pressing the equals button on the calculator.
   * @example
   * ```ts @import.meta.vitest
   * const calc = new Calculator()
   * calc.pressNumberButton(5)
   * calc.pressOperatorButton("+")
   * calc.pressNumberButton(3)
   * calc.pressEqualsButton()
   * expect(calc.getAccumulator()).toStrictEqual(Big(8))
   * ```
   */
  public pressEqualsButton(): void {
    this.applyPendingOperation();
    this.updateAccumulatorIfNeeded();
    this.resetCalculatorState();
  }

  /**
   * Simulates pressing a key on the calculator.
   * @param {unknown} s - The key to press.
   * @throws {Error} If the input is not a string or is an invalid key.
   * @example
   * ```ts @import.meta.vitest
   * const calc = new Calculator()
   * calc.pressKey("5")
   * calc.pressKey("+")
   * calc.pressKey("3")
   * calc.pressKey("=")
   * expect(calc.getAccumulator()).toStrictEqual(Big(8))
   * ```
   */
  public pressKey(s: unknown): void {
    if (typeof s !== "string") {
      throw new Error(`Expected string, got ${typeof s}`);
    }

    if (isDigit(s)) {
      this.pressNumberButton(Number(s));
      return;
    }

    if (isOperator(s)) {
      this.pressOperatorButton(s);
      return;
    }

    // Check for special keys (=, Enter, Backspace, .)
    const handler: (() => void) | undefined = this.keyHandlers[s];
    if (handler !== undefined) {
      handler();
      return;
    }

    throw new Error(`Invalid key: ${s}`);
  }
  /**
   * Simulates pressing a sequence of keys on the calculator.
   * @param {unknown} s - The string of keys to press.
   * @throws {Error} If the input is not a string.
   * @example
   * ```ts @import.meta.vitest
   * const calc = new Calculator()
   * calc.pressKeys("5+3=")
   * expect(calc.getAccumulator()).toStrictEqual(Big(8))
   * ```
   */
  public pressKeys(s: unknown): void {
    if (typeof s !== "string") {
      throw new Error(`Expected string, got ${typeof s}`);
    }
    for (const key of s) {
      this.pressKey(key);
    }
  }
  /**
   * Process a number button press.
   *
   * @param {unknown} n - The number pressed.
   * @throws {Error} If the input is not a single-digit number.
   * @example
   * ```ts @import.meta.vitest
   * const calc = new Calculator()
   * calc.pressNumberButton(5)
   * expect(calc.getCurrentInputNumber()).toStrictEqual(Big(5))
   * ```
   */
  public pressNumberButton(n: unknown): void {
    assertIsSingleDigitNumber(n);

    let decimalPlaceMultiplier: Big = Big(1);
    if (this.decimalButtonPressed) {
      assertIsNotNull(this.nextDecimalPlace);
      decimalPlaceMultiplier = decimalPlaceToMultiplier(this.nextDecimalPlace);
    }

    if (this.currentInputNumber !== null) {
      // There is already a current input number, so further digits just go
      // on the end.

      // Depending on whether the "decimal" button has been pressed, this
      // changes how the new digit gets added onto the existing user input number.

      if (this.decimalButtonPressed) {
        assertIsNotNull(this.nextDecimalPlace);
        // The "Decimal" button was pressed earlier for this number, so this
        // digit gets added to the end of the fractional part of the number.
        this.currentInputNumber = this.currentInputNumber.plus(
          Big(n).mul(decimalPlaceMultiplier),
        );
        this.nextDecimalPlace += 1;
      } else {
        // The "Decimal" button has not (yet) been pressed for this number, so
        // this digit goes to the end of the whole part of the number.
        this.currentInputNumber = this.currentInputNumber.mul(10).add(n);
      }
    } else if (this.decimalButtonPressed) {
      assertIsNotNull(this.nextDecimalPlace);
      this.currentInputNumber = Big(n).mul(decimalPlaceMultiplier);
      this.nextDecimalPlace += 1;
    } else {
      // There is no current input number, so this digit is the first one.
      this.currentInputNumber = Big(n);
    }
  }

  /**
   * Process an operator button press.
   *
   * @param {unknown} n - The operator pressed.
   * @throws {Error} If the input is not a valid operator.
   * @example
   * ```ts @import.meta.vitest
   * const calc = new Calculator()
   * calc.pressOperatorButton("+")
   * expect(calc.getNextOperator()).toBe("+")
   * ```
   */
  public pressOperatorButton(n: unknown): void {
    const op: Operator = parseOperator(n);
    // Store the current operator before updating it
    const currentOperator: Operator | null = this.nextOperator;
    this.nextOperator = op;

    this.applyCurrentOperator(currentOperator);
    this.updateAccumulatorIfNeeded();
    this.resetInputNumberState();
  }

  /**
   * Removes the decimal point from the current input number.
   *
   * @private
   */
  private removeDecimalPoint(): void {
    this.decimalButtonPressed = false;
    this.nextDecimalPlace = null;
  }
  /**
   * Removes the last decimal place from the current input number.
   *
   * @private
   */
  private removeLastDecimalPlace(): void {
    assertIsNotNull(this.nextDecimalPlace);
    const wantedPlaces: number = this.nextDecimalPlace - 2;
    this.currentInputNumber = this.currentInputNumber!.round(wantedPlaces, 0);
    this.nextDecimalPlace--;
  }
  /**
   * Resets the input number state of the calculator.
   *
   * @private
   */
  private resetCalculatorState(): void {
    this.resetInputNumberState();
    this.nextOperator = null;
  }
  /**
   * Resets the input number state of the calculator.
   *
   * @private
   */
  private resetInputNumberState(): void {
    this.currentInputNumber = null;
    this.decimalButtonPressed = false;
    this.nextDecimalPlace = null;
  }
  /**
   * Sets the next decimal place. This method is unsafe and should be used with caution.
   * @param {number | null} n - The value to set for the next decimal place.
   * @example
   * ```ts @import.meta.vitest
   * const calc = new Calculator()
   * calc.unsafeSetNextDecimalPlace(3)
   * expect(calc.getNextDecimalPlace()).toBe(3)
   * ```
   */
  public unsafeSetNextDecimalPlace(n: number | null): void {
    this.nextDecimalPlace = n;
  }
  /**
   * Update the accumulator with the current input number if needed.
   *
   * @private
   */
  private updateAccumulatorIfNeeded(): void {
    if (this.accumulator === null && this.currentInputNumber !== null) {
      this.accumulator = this.currentInputNumber;
    }
  }
}
