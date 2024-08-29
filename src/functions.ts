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
 * add(Big(5), Big(3)) // Returns Big(8)
 * add("Infinity", Big(3)) // Returns "Infinity"
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
 * subtract(Big(10), Big(4)) // Returns Big(6)
 * subtract("Infinity", Big(5)) // Returns "Infinity"
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
 * multiply(Big(3), Big(4)) // Returns Big(12)
 * multiply("Infinity", Big(2)) // Returns "Infinity"
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
 * divide(Big(12), Big(3)) // Returns Big(4)
 * divide("Infinity", Big(2)) // Returns "Infinity"
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
 * const addFunc = getOpFunc("+")
 * addFunc(Big(3), Big(4)) // Returns Big(7)
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
 * operatorFunc("+", Big(5), Big(3)) // Returns Big(8)
 * operatorFunc("*", "Infinity", Big(2)) // Returns "Infinity"
 */
export function operatorFunc(
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
 * parseOperator("+") // Returns "+"
 * parseOperator("x") // Throws Error: Invalid operator: x
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
 * isOperator("+") // Returns true
 * isOperator("x") // Returns false
 */
function isOperator(s: string): s is Operator {
  return operators.includes(s as Operator);
}

/**
 * Return true if `s` is an integer digit, otherwise false.
 * @param {unknown} s - The value to be checked.
 * @returns {boolean} - True if `s` was a digit, otherwise `false`.
 * @example
 * isDigit("1")
 * // => true
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
 * assertIsSingleDigitNumber(5) // Does not throw
 * assertIsSingleDigitNumber(10) // Throws Error: Value 10 is not a single digit integer
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
 * assertIsNotNull(5) // Does not throw
 * assertIsNotNull(null) // Throws Error: Value is null
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
 * notImplemented() // Throws Error: Not yet implemented
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
 * decimalPlaceToMultiplier(2) // Returns Big(0.01)
 * decimalPlaceToMultiplier(0) // Throws Error: Decimal place must be a positive integer
 */
export function decimalPlaceToMultiplier(decimalPlace: number): Big {
  if (decimalPlace < 1 || !Number.isInteger(decimalPlace)) {
    throw new Error("Decimal place must be a positive integer");
  }
  return Big(10).pow(-decimalPlace);
}

/**
 * Represents a basic calculator with arithmetic operations.
 */
export class Calculator {
  private accumulator: Big | "Infinity" | null = null;
  private nextOperator: Operator | null = null;

  // State relating to the current input number:
  private currentInputNumber: Big | null = null;
  private decimalButtonPressed: boolean = false;
  nextDecimalPlace: number | null = null;

  /**
   * Get the current value of the accumulator.
   *
   * @returns {Big | "Infinity" | null} The current accumulator value.
   * @example
   * const calc = new Calculator();
   * calc.getAccumulator() // Returns null
   */
  public getAccumulator(): Big | "Infinity" | null {
    return this.accumulator;
  }

  /**
   * Get the next operator to be applied.
   *
   * @returns {Operator | null} The next operator or null if not set.
   * @example
   * const calc = new Calculator();
   * calc.getNextOperator() // Returns null
   */
  public getNextOperator(): Operator | null {
    return this.nextOperator;
  }

  /**
   * Process a number button press.
   *
   * @param {unknown} n - The number pressed.
   * @throws {Error} If the input is not a single-digit number.
   * @example
   * const calc = new Calculator();
   * calc.pressNumberButton(5)
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

      // Depending on whether "decimal" button has been pressed, this changes
      //  how the new digit gets added onto the existing user input number.

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
   * const calc = new Calculator();
   * calc.pressOperatorButton("+")
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
   * Apply the current operator to the accumulator and current input number.
   *
   * @param {Operator | null} currentOperator - The current operator to apply.
   * @private
   * @example
   * // Assuming this.accumulator is 5 and this.currentInputNumber is 3
   * this.applyCurrentOperator('+');
   * // this.accumulator is now 8
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
   * Update the accumulator with the current input number if needed.
   *
   * @private
   * @example
   * // Assuming this.accumulator is null and this.currentInputNumber is 5
   * this.updateAccumulatorIfNeeded();
   * // this.accumulator is now 5
   */
  private updateAccumulatorIfNeeded(): void {
    if (this.accumulator === null && this.currentInputNumber !== null) {
      this.accumulator = this.currentInputNumber;
    }
  }

  /**
   * Get the current input number.
   *
   * @returns {Big | null} The current input number or null if not set.
   * @example
   * const calc = new Calculator();
   * calc.getCurrentInputNumber() // Returns null
   */
  public getCurrentInputNumber(): Big | null {
    return this.currentInputNumber;
  }

  /**
   * Simulates pressing the equals button on the calculator.
   * This method applies any pending operation, updates the accumulator if needed,
   * and resets the calculator state for the next operation.
   *
   * @example
   * const calc = new Calculator();
   * calc.pressNumberButton(5);
   * calc.pressOperatorButton("+");
   * calc.pressNumberButton(3);
   * calc.pressEqualsButton();
   * // The display now shows "8"
   */
  public pressEqualsButton(): void {
    this.applyPendingOperation();
    this.updateAccumulatorIfNeeded();
    this.resetCalculatorState();
  }

  /**
   * Apply the pending operation to the accumulator and current input number.
   *
   * @private
   * @example
   * // Assuming this.accumulator is 5, this.nextOperator is '+', and this.currentInputNumber is 3
   * this.applyPendingOperation();
   * // this.accumulator is now 8
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
   * @param {Operator} op - The operator to use for the calculation.
   * @param {Big | "Infinity"} acc - The accumulator value.
   * @param {Big} input - The input value.
   * @returns {Big | "Infinity"} The result of the calculation.
   * @example
   * const calc = new Calculator();
   * const result = calc.calculateResult("+", Big(5), Big(3));
   * // result is Big(8)
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
   * Resets the calculator state to its initial values.
   * @example
   * const calc = new Calculator();
   * calc.pressKeys("123+456");
   * calc.resetCalculatorState();
   * // Calculator state is now reset
   */
  private resetCalculatorState(): void {
    this.resetInputNumberState();
    this.nextOperator = null;
  }

  /**
   * Simulates pressing the decimal button on the calculator.
   * @example
   * const calc = new Calculator();
   * calc.pressDecimalButton();
   * // Decimal button is now pressed
   */
  public pressDecimalButton(): void {
    if (!this.decimalButtonPressed) {
      this.decimalButtonPressed = true;
      this.nextDecimalPlace = 1;
    }
  }

  /**
   * Gets the current state of the decimal button.
   * @returns {boolean} True if the decimal button is pressed, false otherwise.
   * @example
   * const calc = new Calculator();
   * calc.pressDecimalButton();
   * const isDecimalPressed = calc.getDecimalButtonPressed();
   * // isDecimalPressed is true
   */
  public getDecimalButtonPressed(): boolean {
    return this.decimalButtonPressed;
  }

  /**
   * Gets the next decimal place to be used.
   * @returns {number | null} The next decimal place or null if not set.
   * @example
   * const calc = new Calculator();
   * calc.pressDecimalButton();
   * calc.pressNumberButton(5);
   * const nextDecimalPlace = calc.getNextDecimalPlace();
   * // nextDecimalPlace is 2
   */
  public getNextDecimalPlace(): number | null {
    return this.nextDecimalPlace;
  }

  /**
   * Sets the next decimal place. This method is unsafe and should be used with caution.
   * @param {number | null} n - The value to set for the next decimal place.
   * @example
   * const calc = new Calculator();
   * calc.unsafeSetNextDecimalPlace(3);
   * // Next decimal place is now set to 3
   */
  public unsafeSetNextDecimalPlace(n: number | null): void {
    this.nextDecimalPlace = n;
  }

  /**
   * Gets the current display string of the calculator.
   * @returns {string} The current display string.
   * @example
   * const calc = new Calculator();
   * calc.pressKeys("123.45");
   * const display = calc.getDisplayString();
   * // display is "123.45"
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
   * Simulates pressing the clear button on the calculator.
   * @example
   * const calc = new Calculator();
   * calc.pressKeys("123+456");
   * calc.pressClearButton();
   * // Calculator is now cleared
   */
  public pressClearButton(): void {
    this.accumulator = null;
    this.nextOperator = null;
    this.resetInputNumberState();
  }

  /**
   * Simulates pressing the backspace button on the calculator.
   * @example
   * const calc = new Calculator();
   * calc.pressKeys("123");
   * calc.pressBackspaceButton();
   * // Display now shows "12"
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
   * Handles backspace operation for decimal numbers.
   *
   * @private
   * @example
   * // Assuming this.currentInputNumber is 1.23 and this.nextDecimalPlace is 3
   * this.handleDecimalBackspace();
   * // this.currentInputNumber is now 1.2 and this.nextDecimalPlace is 2
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
   * Removes the last decimal place from the current input number.
   *
   * @private
   * @example
   * // Assuming this.currentInputNumber is 1.23 and this.nextDecimalPlace is 3
   * this.removeLastDecimalPlace();
   * // this.currentInputNumber is now 1.2 and this.nextDecimalPlace is 2
   */
  private removeLastDecimalPlace(): void {
    assertIsNotNull(this.nextDecimalPlace);
    const wantedPlaces: number = this.nextDecimalPlace - 2;
    this.currentInputNumber = this.currentInputNumber!.round(wantedPlaces, 0);
    this.nextDecimalPlace--;
  }

  /**
   * Removes the decimal point from the current input number.
   *
   * @private
   * @example
   * // Assuming this.currentInputNumber is 1.2, this.decimalButtonPressed is true, and this.nextDecimalPlace is 1
   * this.removeDecimalPoint();
   * // this.decimalButtonPressed is now false and this.nextDecimalPlace is null
   */
  private removeDecimalPoint(): void {
    this.decimalButtonPressed = false;
    this.nextDecimalPlace = null;
  }

  /**
   * Handles backspace operation for whole numbers.
   *
   * @private
   * @example
   * // Assuming this.currentInputNumber is 123
   * this.handleWholeNumberBackspace();
   * // this.currentInputNumber is now 12
   */
  private handleWholeNumberBackspace(): void {
    this.currentInputNumber = this.currentInputNumber!.div(10).round(0, 0);
  }

  // Map of special key handlers
  private keyHandlers: { [key: string]: () => void } = {
    /**
     * Handles the equals key press.
     *
     * @returns {void}
     * @example
     * this.keyHandlers["="]();
     * // Equivalent to this.pressEqualsButton()
     */
    "=": () => this.pressEqualsButton(),

    /**
     * Handles the Enter key press.
     *
     * @returns {void}
     * @example
     * this.keyHandlers["Enter"]();
     * // Equivalent to this.pressEqualsButton()
     */
    Enter: () => this.pressEqualsButton(),

    /**
     * Handles the Backspace key press.
     *
     * @returns {void}
     * @example
     * this.keyHandlers["Backspace"]();
     * // Equivalent to this.pressBackspaceButton()
     */
    Backspace: () => this.pressBackspaceButton(),

    /**
     * Handles the decimal point key press.
     *
     * @returns {void}
     * @example
     * this.keyHandlers["."]();
     * // Equivalent to this.pressDecimalButton()
     */
    ".": () => this.pressDecimalButton(),
  };

  /**
   * Simulates pressing a key on the calculator.
   * @param {unknown} s - The key to press.
   * @throws {Error} If the input is not a string or is an invalid key.
   * @example
   * const calc = new Calculator();
   * calc.pressKey("5");
   * calc.pressKey("+");
   * calc.pressKey("3");
   * calc.pressKey("=");
   * // Display now shows "8"
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
   * const calc = new Calculator();
   * calc.pressKeys("5+3=");
   * // Display now shows "8"
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
   * Resets the input number state of the calculator.
   *
   * @private
   * @example
   * // Assuming this.currentInputNumber is 123, this.decimalButtonPressed is true, and this.nextDecimalPlace is 2
   * this.resetInputNumberState();
   * // this.currentInputNumber is now null, this.decimalButtonPressed is false, and this.nextDecimalPlace is null
   */
  private resetInputNumberState(): void {
    this.currentInputNumber = null;
    this.decimalButtonPressed = false;
    this.nextDecimalPlace = null;
  }

  /**
   * Handles UI button presses on the calculator.
   * @param {string} s - The button pressed.
   * @throws {Error} If an invalid button is pressed.
   * @example
   * const calc = new Calculator();
   * calc.handleUiButtonPressed("1");
   * calc.handleUiButtonPressed("+");
   * calc.handleUiButtonPressed("2");
   * calc.handleUiButtonPressed("=");
   * // Display now shows "3"
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
}
