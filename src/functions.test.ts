import Big from "big.js";

import {
  add,
  assertIsNotNull,
  assertIsSingleDigitNumber,
  Calculator,
  decimalPlaceToMultiplier,
  divide,
  getOpFunc,
  isDigit,
  MAX_DECIMAL_PLACES_IN_DISPLAY,
  multiply,
  notImplemented,
  Operator,
  operatorFunc,
  parseOperator,
  subtract,
} from "./functions.js";

describe("add function", () => {
  test("adding 1 and 2 returns 3", () => {
    expect(add(Big(1), Big(2))).toStrictEqual(Big(3));
  });

  test("adding 5 and 6 returns 11", () => {
    expect(add(Big(5), Big(6))).toStrictEqual(Big(11));
  });

  test("Passing infinity as the first argument should return infinity", () => {
    expect(add("Infinity", Big(5))).toBe("Infinity");
  });
});

describe("subtract function", () => {
  test("subtracting 5 from 7 returns 2", () => {
    expect(subtract(Big(7), Big(5))).toStrictEqual(Big(2));
  });

  test("subtracting 7 from 2 returns -5", () => {
    expect(subtract(Big(2), Big(7))).toStrictEqual(Big(-5));
  });

  test("Passing infinity as the first argument should return infinity", () => {
    expect(subtract("Infinity", Big(5))).toBe("Infinity");
  });
});

describe("multiply function", () => {
  test("multiplying 2 by 3 returns 6", () => {
    expect(multiply(Big(2), Big(3))).toStrictEqual(Big(6));
  });

  test("multiplying -5 by 10 returns -50", () => {
    expect(multiply(Big(-5), Big(10))).toStrictEqual(Big(-50));
  });

  test("Passing infinity as the first argument should return infinity", () => {
    expect(multiply("Infinity", Big(5))).toBe("Infinity");
  });
});

describe("divide function", () => {
  test("dividing 10 by 2 returns 5", () => {
    expect(divide(Big(10), Big(2))).toStrictEqual(Big(5));
  });

  test("dividing 6 by 3 returns 2", () => {
    expect(divide(Big(6), Big(3))).toStrictEqual(Big(2));
  });

  test("Passing infinity as the first argument should return infinity", () => {
    expect(divide("Infinity", Big(5))).toBe("Infinity");
  });
});

describe("operate function", () => {
  test("dividing 10 by 2 returns 5", () => {
    expect(operatorFunc("/", Big(10), Big(2))).toStrictEqual(Big(5));
  });

  test("adding 7 to 5 returns 12", () => {
    expect(operatorFunc("+", Big(7), Big(5))).toStrictEqual(Big(12));
  });

  test("Passing infinity as the first numeric argument should return infinity", () => {
    expect(operatorFunc("/", "Infinity", Big(5))).toBe("Infinity");
  });
});

describe("getOpFunc function", () => {
  test("Passing in '+' gets the 'add' function", () => {
    expect(getOpFunc("+")).toBe(add);
  });

  test("Passing in '-' gets the 'subtract' function", () => {
    expect(getOpFunc("-")).toBe(subtract);
  });

  test("Passing in '*' gets the 'multiply' function", () => {
    expect(getOpFunc("*")).toBe(multiply);
  });

  test("Passing in '/' gets the 'divide' function", () => {
    expect(getOpFunc("/")).toBe(divide);
  });
});

describe("isDigit function", () => {
  test("an empty string is not a digit", () => {
    expect(isDigit("")).toBe(false);
  });

  test("A '1' string is a digit", () => {
    expect(isDigit("1")).toBe(true);
  });

  test("A '3' string is a digit", () => {
    expect(isDigit("3")).toBe(true);
  });

  test("A 'S' string is a digit", () => {
    expect(isDigit("S")).toBe(false);
  });

  test("A '1234' string is not a digit", () => {
    expect(isDigit("1234")).toBe(false);
  });

  test("An undefined value is not a digit", () => {
    expect(isDigit(undefined)).toBe(false);
  });
});

describe("notImplemented function", () => {
  test("It throws an Error with a 'Not yet implemented' message", () => {
    expect(() => {
      notImplemented();
    }).toThrow("Not yet implemented");
  });
});

describe("assertIsSingleDigitNumber function", () => {
  test("Succeeds for correct inputs", () => {
    expect(() => {
      const s: unknown = 5;

      assertIsSingleDigitNumber(s);

      // Force type check and prevent inlining
      const ensureNumber: number = s;
      Object.defineProperty(globalThis, "__typeCheck", {
        get: () => ensureNumber,
        configurable: true,
      });

      // Note: After this test, we will have a random "__typeCheck" attribute
      // on the global object.
    }).not.toThrow();
  });

  test("Fails for none-number inputs", () => {
    expect(() => {
      assertIsSingleDigitNumber("5");
    }).toThrow("Value 5 is not a single digit integer");
  });

  test("Fails for none-integer numbers", () => {
    expect(() => {
      assertIsSingleDigitNumber(5.5);
    }).toThrow("Value 5.5 is not a single digit integer");
  });

  test("Fails for negative numbers", () => {
    expect(() => {
      assertIsSingleDigitNumber(-7);
    }).toThrow("Value -7 is not a single digit integer");
  });

  test("Fails for numbers past 9", () => {
    expect(() => {
      assertIsSingleDigitNumber(10);
    }).toThrow("Value 10 is not a single digit integer");
  });
});

describe("assertIsNotNull function", () => {
  test("Passing a null value should throw an error", () => {
    expect(() => {
      assertIsNotNull(null);
    }).toThrow("Value is null");
  });

  test("Passing a none-null value should not throw an error", () => {
    expect(() => {
      assertIsNotNull(5);
    }).not.toThrow();
  });
});

describe("parseOperator function", () => {
  test("Fails for none-strings", () => {
    expect(() => {
      parseOperator(5);
    }).toThrow("Expected string, got number");
  });

  test("Fails for strings that that are not one character long", () => {
    expect(() => {
      parseOperator("++");
    }).toThrow("Invalid operator: ++");
  });

  test("Fails for unknown operator", () => {
    expect(() => {
      parseOperator("x");
    }).toThrow("Invalid operator: x");
  });

  test("Parses '+' correctly", () => {
    const expected: Operator = "+";
    expect(parseOperator("+")).toBe(expected);
  });

  test("Parses '-' correctly", () => {
    const expected: Operator = "-";
    expect(parseOperator("-")).toBe(expected);
  });

  test("Parses '*' correctly", () => {
    const expected: Operator = "*";
    expect(parseOperator("*")).toBe(expected);
  });

  test("Parses '/' correctly", () => {
    const expected: Operator = "/";
    expect(parseOperator("/")).toBe(expected);
  });
});

describe("decimalPlaceToMultiplier function", () => {
  test("Passing 1 to it returns 0.1", () => {
    expect(decimalPlaceToMultiplier(1)).toStrictEqual(Big(0.1));
  });

  test("Passing 2 to it returns 0.01", () => {
    expect(decimalPlaceToMultiplier(2)).toStrictEqual(Big(0.01));
  });

  test("Passing 3 to it returns 0.001", () => {
    expect(decimalPlaceToMultiplier(3)).toStrictEqual(Big(0.001));
  });

  test("Passing 0 to it should be an error", () => {
    expect(() => {
      decimalPlaceToMultiplier(0);
    }).toThrow("Decimal place must be a positive integer");
  });

  test("Passing 5.5 to it should be an error", () => {
    expect(() => {
      decimalPlaceToMultiplier(5.5);
    }).toThrow("Decimal place must be a positive integer");
  });
});

describe("Calculator class", () => {
  test("The displayed string is initially 0", () => {
    const calc = new Calculator();
    expect(calc.getDisplayString()).toBe("0");
  });

  test("After pressing 1 the displayed string should be 1", () => {
    const calc = new Calculator();
    calc.pressNumberButton(1);
    expect(calc.getDisplayString()).toBe("1");
  });

  test("After pressing 2 then 3, the displayed string should be 23", () => {
    const calc = new Calculator();
    calc.pressNumberButton(2);
    calc.pressNumberButton(3);
    expect(calc.getDisplayString()).toBe("23");
  });

  describe("pressKey method", () => {
    it("Causes the decimal key to be pressed when a period is sent", () => {
      const calc = new Calculator();
      calc.pressKeys(".123");
      expect(calc.getDisplayString()).toBe("0.123");
    });
  });

  describe("pressEqualsButton method", () => {
    it("Updates the accumulator when there is a current input number and an operator, but no accumulator.", () => {
      const calc = new Calculator();
      calc.pressKeys("+123=");
      expect(calc.getAccumulator()).toStrictEqual(Big(123));
    });
    it("Does nothing when there is an operator, but no current input number or accumulator.", () => {
      const calc = new Calculator();
      calc.pressKeys("+=");
      expect(calc.getAccumulator()).toBe(null);
      expect(calc.getDisplayString()).toBe("0");
    });
    it("Stores the current input number in the accumulator when there is an input number, an accumulator, but there is no next operator", () => {
      const calc = new Calculator();
      calc.pressKeys("100=100=");
      expect(calc.getAccumulator()).toStrictEqual(Big(100));
      expect(calc.getDisplayString()).toBe("100");
    });
  });

  describe("pressBackspaceButton method", () => {
    it("Fails if nextDecimalPlace has a 0 value when it should be impossible", () => {
      const calc = new Calculator();
      calc.pressKeys("123.");
      calc.unsafeSetNextDecimalPlace(0);
      expect(() => {
        calc.pressBackspaceButton();
      }).toThrow("Next decimal place should not be 0");
    });

    it("Handles erasing the last decimal place correctly", () => {
      const calc = new Calculator();
      calc.pressKeys("123.");
      calc.pressBackspaceButton();
      // After this point, decimalButtonPressed should be set back to
      // false, nextDecimalPlace should be set back to null, and the
      // display string should be "123"
      expect(calc.getDecimalButtonPressed()).toBe(false);
      expect(calc.getNextDecimalPlace()).toBe(null);
      expect(calc.getDisplayString()).toBe("123");
    });

    it("Fails if nextDecimalPlace has a NaN value when it should be impossible", () => {
      const calc = new Calculator();
      calc.pressKeys("123.");
      calc.unsafeSetNextDecimalPlace(NaN);
      expect(() => {
        calc.pressBackspaceButton();
      }).toThrow("Next decimal place should not be NaN");
    });
  });

  describe("pressOperatorButton method", () => {
    test("Pressing the '+' button should set the next operator to '+'", () => {
      const calc = new Calculator();
      calc.pressOperatorButton("+");
      expect(calc.getNextOperator()).toBe("+");
    });

    test("Pressing the '-' button should set the next operator to '-'", () => {
      const calc = new Calculator();
      calc.pressOperatorButton("-");
      expect(calc.getNextOperator()).toBe("-");
    });

    test("Pressing the '*' button should set the next operator to '*'", () => {
      const calc = new Calculator();
      calc.pressOperatorButton("*");
      expect(calc.getNextOperator()).toBe("*");
    });

    test("Pressing the '/' button should set the next operator to '/'", () => {
      const calc = new Calculator();
      calc.pressOperatorButton("/");
      expect(calc.getNextOperator()).toBe("/");
    });

    test("Pressing the '+' button after pressing a number should set the next operator to '+'", () => {
      const calc = new Calculator();
      calc.pressNumberButton(5);
      calc.pressOperatorButton("+");
      expect(calc.getNextOperator()).toBe("+");
    });

    test("Pressing the '+' button after pressing an operator should set the next operator to '+'", () => {
      const calc = new Calculator();
      calc.pressOperatorButton("*");
      calc.pressOperatorButton("+");
      expect(calc.getNextOperator()).toBe("+");
    });

    test("Pressing the '+' button after pressing the equals button should set the next operator to '+'", () => {
      const calc = new Calculator();
      calc.pressEqualsButton();
      calc.pressOperatorButton("+");
      expect(calc.getNextOperator()).toBe("+");
    });

    test("Pressing the '+' button after pressing the clear button should set the next operator to '+'", () => {
      const calc = new Calculator();
      calc.pressClearButton();
      calc.pressOperatorButton("+");
      expect(calc.getNextOperator()).toBe("+");
    });

    test("Pressing the '+' button after pressing the backspace button should set the next operator to '+'", () => {
      const calc = new Calculator();
      calc.pressBackspaceButton();
      calc.pressOperatorButton("+");
      expect(calc.getNextOperator()).toBe("+");
    });

    test("Pressing the '+' button after pressing the decimal button should set the next operator to '+'", () => {
      const calc = new Calculator();
      calc.pressDecimalButton();
      calc.pressOperatorButton("+");
      expect(calc.getNextOperator()).toBe("+");
    });

    test(
      "Pressing '+', then '1', then '+' again displays " +
        " and sets the next operator to '+'",
      () => {
        const calc = new Calculator();
        calc.pressOperatorButton("+");
        calc.pressNumberButton(1);
        calc.pressOperatorButton("+");
        expect(calc.getDisplayString()).toBe("+");
        expect(calc.getNextOperator()).toBe("+");
      },
    );

    test("Pressing '1', 'equals', '2', then '+' displays '+' and sets the next operator to '+'", () => {
      const calc = new Calculator();
      calc.pressNumberButton(1);
      calc.pressEqualsButton();
      calc.pressNumberButton(2);
      calc.pressOperatorButton("+");
      expect(calc.getDisplayString()).toBe("+");
      expect(calc.getNextOperator()).toBe("+");
    });
  });

  describe("getDecimalButtonPressed method", () => {
    test("Before pressing the decimal point button, it should be recorded as not yet pressed", () => {
      const calc = new Calculator();
      expect(calc.getDecimalButtonPressed()).toBe(false);
    });

    test("Pressing the decimal point button sets it to true", () => {
      const calc = new Calculator();
      calc.pressDecimalButton();
      expect(calc.getDecimalButtonPressed()).toBe(true);
    });

    test("Pressing the decimal point button twice leaves it at true", () => {
      const calc = new Calculator();
      calc.pressDecimalButton();
      calc.pressDecimalButton();
      expect(calc.getDecimalButtonPressed()).toBe(true);
    });

    test("Pressing a number after the decimal point leaves it at true", () => {
      const calc = new Calculator();
      calc.pressDecimalButton();
      calc.pressNumberButton(1);
      expect(calc.getDecimalButtonPressed()).toBe(true);
    });

    test("Pressing an operator after the decimal point sets it to false", () => {
      const calc = new Calculator();
      calc.pressDecimalButton();
      calc.pressOperatorButton("+");
      expect(calc.getDecimalButtonPressed()).toBe(false);
    });

    test("Pressing an equal after the decimal point sets it to false", () => {
      const calc = new Calculator();
      calc.pressDecimalButton();
      calc.pressEqualsButton();
      expect(calc.getDecimalButtonPressed()).toBe(false);
    });

    test("Pressing the decimal point after an equal sets it to true", () => {
      const calc = new Calculator();
      calc.pressDecimalButton();
      calc.pressEqualsButton();
      calc.pressDecimalButton();
      expect(calc.getDecimalButtonPressed()).toBe(true);
    });

    test("Pressing the decimal point after a number sets it to true", () => {
      const calc = new Calculator();
      calc.pressNumberButton(1);
      calc.pressDecimalButton();
      expect(calc.getDecimalButtonPressed()).toBe(true);
    });

    test("Pressing the decimal point after an operator sets it to true", () => {
      const calc = new Calculator();
      calc.pressOperatorButton("+");
      calc.pressDecimalButton();
      expect(calc.getDecimalButtonPressed()).toBe(true);
    });

    test("Pressing the decimal point after a decimal point leaves it at true", () => {
      const calc = new Calculator();
      calc.pressDecimalButton();
      calc.pressDecimalButton();
      expect(calc.getDecimalButtonPressed()).toBe(true);
    });

    test("Pressing the decimal point after a number and an operator sets it to true", () => {
      const calc = new Calculator();
      calc.pressNumberButton(1);
      calc.pressOperatorButton("+");
      calc.pressDecimalButton();
      expect(calc.getDecimalButtonPressed()).toBe(true);
    });

    test("A decimal point followed by 12, leads to 0.12", () => {
      const calc = new Calculator();
      calc.pressDecimalButton();
      calc.pressNumberButton(1);
      calc.pressNumberButton(2);
      expect(calc.getDisplayString()).toBe("0.12");
    });

    test("0 point 3 gives 0.3", () => {
      const calc = new Calculator();
      calc.pressNumberButton(0);
      calc.pressDecimalButton();
      calc.pressNumberButton(3);
      expect(calc.getDisplayString()).toBe("0.3");
    });

    test("point 5 6 gives 0.56", () => {
      const calc = new Calculator();
      calc.pressDecimalButton();
      calc.pressNumberButton(5);
      calc.pressNumberButton(6);
      expect(calc.getDisplayString()).toBe("0.56");
    });
  });

  describe("getNextDecimalPlace method", () => {
    test("The next decimal place starts at null", () => {
      const calc = new Calculator();
      expect(calc.getNextDecimalPlace()).toBe(null);
    });

    test("The next decimal place changes to 1 after pressing the decimal button", () => {
      const calc = new Calculator();
      calc.pressDecimalButton();
      expect(calc.getNextDecimalPlace()).toBe(1);
    });

    test("Pressing the decimal button twice also sets the next decimal place to 1", () => {
      const calc = new Calculator();
      calc.pressDecimalButton();
      calc.pressDecimalButton();
      expect(calc.getNextDecimalPlace()).toBe(1);
    });

    test("The next decimal place changes to 2 after pressing the decimal button once and then pressing a number", () => {
      const calc = new Calculator();
      calc.pressDecimalButton();
      calc.pressNumberButton(1);
      expect(calc.getNextDecimalPlace()).toBe(2);
    });

    test("The next decimal place changes to 3 after pressing the decimal button once and then pressing a number twice", () => {
      const calc = new Calculator();
      calc.pressDecimalButton();
      calc.pressNumberButton(1);
      calc.pressNumberButton(2);
      expect(calc.getNextDecimalPlace()).toBe(3);
    });

    test("The next decimal place changes to null after pressing the decimal button once and then pressing an operator", () => {
      const calc = new Calculator();
      calc.pressDecimalButton();
      calc.pressOperatorButton("+");
      expect(calc.getNextDecimalPlace()).toBe(null);
    });

    test("The next decimal place changes to null after pressing the decimal button once and then pressing the 'equals' button", () => {
      const calc = new Calculator();
      calc.pressDecimalButton();
      calc.pressEqualsButton();
      expect(calc.getNextDecimalPlace()).toBe(null);
    });

    test("The next decimal place changes to 1 after pressing the decimal button once, then the 'equals' button, and then the decimal button", () => {
      const calc = new Calculator();
      calc.pressDecimalButton();
      calc.pressEqualsButton();
      calc.pressDecimalButton();
      expect(calc.getNextDecimalPlace()).toBe(1);
    });
  });

  describe("unsafeSetNextDecimalPlace method", () => {
    it("Updates the value of the next decimal place", () => {
      const calc = new Calculator();
      calc.unsafeSetNextDecimalPlace(5);
      expect(calc.getNextDecimalPlace()).toBe(5);
    });
  });

  describe("Invalid inputs to pressNumberButton", () => {
    test("String input", () => {
      const calc = new Calculator();
      expect(() => {
        calc.pressNumberButton("abcd");
      }).toThrow("Value abcd is not a single digit integer");
    });

    test("Multiple digits", () => {
      const calc = new Calculator();
      expect(() => {
        calc.pressNumberButton(23);
      }).toThrow("Value 23 is not a single digit integer");
    });
  });

  describe("Invalid inputs to pressOperatorButton", () => {
    test("Integer input", () => {
      const calc = new Calculator();
      expect(() => {
        calc.pressOperatorButton(1);
      }).toThrow("Expected string, got number");
    });

    test("Unknown operator", () => {
      const calc = new Calculator();
      expect(() => {
        calc.pressOperatorButton("++");
      }).toThrow("Invalid operator: ++");
    });
  });

  describe("getCurrentInputNumber", () => {
    test("It starts as null", () => {
      const calc = new Calculator();
      expect(calc.getCurrentInputNumber()).toBe(null);
    });

    test("After pressing a number, it is set to that number", () => {
      const calc = new Calculator();
      calc.pressNumberButton(1);
      expect(calc.getCurrentInputNumber()).toStrictEqual(Big(1));
    });

    test("After pressing two numbers, it is set to the two numbers", () => {
      const calc = new Calculator();
      calc.pressNumberButton(1);
      calc.pressNumberButton(2);
      expect(calc.getCurrentInputNumber()).toStrictEqual(Big(12));
    });

    test("After pressing two numbers and an operator, it is set back to null", () => {
      const calc = new Calculator();
      calc.pressNumberButton(1);
      calc.pressNumberButton(2);
      calc.pressOperatorButton("+");
      expect(calc.getCurrentInputNumber()).toBe(null);
    });

    test("After pressing two numbers and the equals button, it is set back to null", () => {
      const calc = new Calculator();
      calc.pressNumberButton(1);
      calc.pressNumberButton(2);
      calc.pressEqualsButton();
      expect(calc.getCurrentInputNumber()).toBe(null);
    });

    test("After pressing two numbers, an operator, and a number, it is set to the last number", () => {
      const calc = new Calculator();
      calc.pressNumberButton(1);
      calc.pressNumberButton(2);
      calc.pressOperatorButton("+");
      calc.pressNumberButton(3);
      expect(calc.getCurrentInputNumber()).toStrictEqual(Big(3));
    });

    test("After pressing two numbers, then an operator, then the equals button, it is set to null", () => {
      const calc = new Calculator();
      calc.pressNumberButton(1);
      calc.pressNumberButton(2);
      calc.pressOperatorButton("+");
      calc.pressEqualsButton();
      expect(calc.getCurrentInputNumber()).toBe(null);
    });

    test("Handles decimal input correctly", () => {
      const calc = new Calculator();
      calc.pressNumberButton(1);
      calc.pressDecimalButton();
      calc.pressNumberButton(5);
      expect(calc.getCurrentInputNumber()).toStrictEqual(Big(1.5));
    });

    test("Handles large numbers", () => {
      const calc = new Calculator();
      calc.pressNumberButton(1);
      calc.pressNumberButton(2);
      calc.pressNumberButton(3);
      calc.pressNumberButton(4);
      calc.pressNumberButton(5);
      calc.pressNumberButton(6);
      calc.pressNumberButton(7);
      calc.pressNumberButton(8);
      calc.pressNumberButton(9);
      expect(calc.getCurrentInputNumber()).toStrictEqual(Big(123456789));
    });

    test("Handles multiple operators pressed in succession", () => {
      const calc = new Calculator();
      calc.pressNumberButton(5);
      calc.pressOperatorButton("+");
      calc.pressOperatorButton("-");
      calc.pressOperatorButton("*");
      calc.pressNumberButton(3);
      expect(calc.getCurrentInputNumber()).toStrictEqual(Big(3));
    });

    test("Handles multiple equals button presses", () => {
      const calc = new Calculator();
      calc.pressNumberButton(5);
      calc.pressOperatorButton("+");
      calc.pressNumberButton(3);
      calc.pressEqualsButton();
      calc.pressEqualsButton();
      calc.pressEqualsButton();
      expect(calc.getCurrentInputNumber()).toBe(null);
    });

    test("Handles leading zeros correctly", () => {
      const calc = new Calculator();
      calc.pressNumberButton(0);
      calc.pressNumberButton(0);
      calc.pressNumberButton(5);
      expect(calc.getCurrentInputNumber()).toStrictEqual(Big(5));
    });

    test("Handles multiple decimal points (should ignore additional ones)", () => {
      const calc = new Calculator();
      calc.pressNumberButton(1);
      calc.pressDecimalButton();
      calc.pressNumberButton(2);
      calc.pressDecimalButton();
      calc.pressNumberButton(3);
      expect(calc.getCurrentInputNumber()).toStrictEqual(Big(1.23));
    });
  });

  describe("getAccumulator method", () => {
    test("The type of numeric return values should be a Big", () => {
      const calc = new Calculator();
      calc.pressNumberButton(1);
      calc.pressNumberButton(2);
      calc.pressOperatorButton("+");
      calc.pressNumberButton(3);
      calc.pressEqualsButton();
      const accumulator = calc.getAccumulator();
      expect(accumulator instanceof Big).toBe(true);
    });

    test("It starts as null", () => {
      const calc = new Calculator();
      expect(calc.getAccumulator()).toBe(null);
    });

    test("After pressing a number, it stays as null", () => {
      const calc = new Calculator();
      calc.pressNumberButton(1);
      expect(calc.getAccumulator()).toBe(null);
    });

    test("After pressing two numbers, it stays as null", () => {
      const calc = new Calculator();
      calc.pressNumberButton(1);
      calc.pressNumberButton(2);
      expect(calc.getAccumulator()).toBe(null);
    });

    test("After pressing a number and an operator, it is set to the number", () => {
      const calc = new Calculator();
      calc.pressNumberButton(1);
      calc.pressOperatorButton("+");
      expect(calc.getAccumulator()).toStrictEqual(Big(1));
    });

    test("After pressing a number and the equals sign, it is set to the number", () => {
      const calc = new Calculator();
      calc.pressNumberButton(1);
      calc.pressEqualsButton();
      expect(calc.getAccumulator()).toStrictEqual(Big(1));
    });

    test("After pressing two numbers and an operator, it is set to the first two numbers", () => {
      const calc = new Calculator();
      calc.pressNumberButton(1);
      calc.pressNumberButton(2);
      calc.pressOperatorButton("+");
      expect(calc.getAccumulator()).toStrictEqual(Big(12));
    });

    test("After pressing two numbers and an operator, then a third number, it is set to the first two numbers", () => {
      const calc = new Calculator();
      calc.pressNumberButton(1);
      calc.pressNumberButton(2);
      calc.pressOperatorButton("+");
      calc.pressNumberButton(3);
      expect(calc.getAccumulator()).toStrictEqual(Big(12));
    });

    test("After pressing two numbers and an operator, then a second operator, it is set to the first two numbers", () => {
      const calc = new Calculator();
      calc.pressNumberButton(1);
      calc.pressNumberButton(2);
      calc.pressOperatorButton("+");
      calc.pressOperatorButton("-");
      expect(calc.getAccumulator()).toStrictEqual(Big(12));
    });

    test("After pressing two numbers and an operator, then a second operator, then a third number, it is set to the first two numbers", () => {
      const calc = new Calculator();
      calc.pressNumberButton(1);
      calc.pressNumberButton(2);
      calc.pressOperatorButton("+");
      calc.pressOperatorButton("-");
      calc.pressNumberButton(3);
      expect(calc.getAccumulator()).toStrictEqual(Big(12));
    });

    test("Dividing by zero causes a string 'Infinity' to be stored in the accumulator", () => {
      const calc = new Calculator();
      calc.pressNumberButton(5);
      calc.pressOperatorButton("/");
      calc.pressNumberButton(0);
      calc.pressEqualsButton();
      expect(calc.getAccumulator()).toBe("Infinity");
    });
  });

  describe("Operator usage", () => {
    test("12 + 7 - , should display 19 and set the next operator to -", () => {
      const calc = new Calculator();
      calc.pressNumberButton(1);
      calc.pressNumberButton(2);
      calc.pressOperatorButton("+");
      calc.pressNumberButton(7);
      calc.pressOperatorButton("-");
      expect(calc.getAccumulator()).toStrictEqual(Big(19));
      expect(calc.getNextOperator()).toBe("-");
    });

    test("Pressing '1', '2', then '+' should leave '+' in the display", () => {
      const calc = new Calculator();
      calc.pressNumberButton(2);
      calc.pressNumberButton(3);
      calc.pressOperatorButton("+");
      expect(calc.getDisplayString()).toBe("+");
    });

    test("12 + 33 input should have 33 on the output", () => {
      const calc = new Calculator();
      calc.pressNumberButton(1);
      calc.pressNumberButton(2);
      calc.pressOperatorButton("+");
      calc.pressNumberButton(3);
      calc.pressNumberButton(3);
      expect(calc.getDisplayString()).toBe("33");
    });

    test("12 + 33, then equal button, should have 45 as the answer", () => {
      const calc = new Calculator();
      calc.pressNumberButton(1);
      calc.pressNumberButton(2);
      calc.pressOperatorButton("+");
      calc.pressNumberButton(3);
      calc.pressNumberButton(3);
      calc.pressEqualsButton();
      expect(calc.getDisplayString()).toBe("45");
    });

    test("Pressing just the minus sign should show just a minus on the display", () => {
      const calc = new Calculator();
      calc.pressOperatorButton("-");
      expect(calc.getDisplayString()).toBe("-");
    });
  });

  describe("Advanced operations", () => {
    test("Division by zero should display a snarky message", () => {
      const calc = new Calculator();
      calc.pressNumberButton(5);
      calc.pressOperatorButton("/");
      calc.pressNumberButton(0);
      calc.pressEqualsButton();
      expect(calc.getDisplayString()).toMatch(
        "No division by zero is allowed, you silly goose!",
      );
    });

    test("Large number calculations", () => {
      const calc = new Calculator();
      calc.pressNumberButton(9);
      for (let i = 0; i < 15; i++) {
        calc.pressNumberButton(9);
      }
      calc.pressOperatorButton("+");
      calc.pressNumberButton(1);
      calc.pressEqualsButton();
      expect(calc.getDisplayString()).toBe("10000000000000000");
    });

    test("Chaining multiple operations", () => {
      // Note: In this Calculator we just do simple operations from left to
      // right, rather than following the order of operations.
      const calc = new Calculator();
      calc.pressNumberButton(5);
      calc.pressOperatorButton("+");
      calc.pressNumberButton(3);
      calc.pressOperatorButton("*");
      calc.pressNumberButton(2);
      calc.pressOperatorButton("-");
      calc.pressNumberButton(1);
      calc.pressEqualsButton();
      expect(calc.getDisplayString()).toBe("15");
    });

    test("Floating-point precision", () => {
      const calc = new Calculator();
      calc.pressNumberButton(0);
      calc.pressDecimalButton();
      calc.pressNumberButton(1);
      calc.pressOperatorButton("+");
      calc.pressNumberButton(0);
      calc.pressDecimalButton();
      calc.pressNumberButton(2);
      calc.pressEqualsButton();
      expect(calc.getDisplayString()).toBe("0.3");
    });
  });

  describe("Error handling", () => {
    test("Invalid operator input", () => {
      const calc = new Calculator();
      calc.pressNumberButton(5);
      expect(() => {
        calc.pressOperatorButton("%");
      }).toThrow("Invalid operator: %");
    });

    test("Multiple decimal points in a number", () => {
      const calc = new Calculator();
      calc.pressNumberButton(1);
      calc.pressDecimalButton();
      calc.pressNumberButton(2);
      calc.pressDecimalButton();
      calc.pressNumberButton(3);
      expect(calc.getDisplayString()).toBe("1.23");
    });
  });

  describe("backspace method", () => {
    test("Backspace pressed first, has no effect", () => {
      const calc = new Calculator();
      calc.pressBackspaceButton();
      expect(calc.getDisplayString()).toBe("0");
    });

    // A 1, then a backspace, leads to just a 0 being displayed
    test("Backspace pressed after a 1, should display 0", () => {
      const calc = new Calculator();
      calc.pressNumberButton(1);
      calc.pressBackspaceButton();
      expect(calc.getDisplayString()).toBe("0");
    });

    test("Backspace pressed after a 1234, should display 12", () => {
      const calc = new Calculator();
      calc.pressNumberButton(1);
      calc.pressNumberButton(2);
      calc.pressNumberButton(3);
      calc.pressNumberButton(4);
      calc.pressBackspaceButton();
      calc.pressBackspaceButton();
      expect(calc.getDisplayString()).toBe("12");
    });

    test("Backspace pressed after a 123.456, should display 123.4", () => {
      const calc = new Calculator();
      calc.pressNumberButton(1);
      calc.pressNumberButton(2);
      calc.pressNumberButton(3);
      calc.pressDecimalButton();
      calc.pressNumberButton(4);
      calc.pressNumberButton(5);
      calc.pressNumberButton(6);
      calc.pressBackspaceButton();
      calc.pressBackspaceButton();
      expect(calc.getDisplayString()).toBe("123.4");
    });

    // 123.456 with backspace pressed 3 times leads to 123 being displayed
    test("Backspace pressed after a 123.456, should display 123", () => {
      const calc = new Calculator();
      calc.pressNumberButton(1);
      calc.pressNumberButton(2);
      calc.pressNumberButton(3);
      calc.pressNumberButton(4);
      calc.pressNumberButton(5);
      calc.pressNumberButton(6);
      calc.pressBackspaceButton();
      calc.pressBackspaceButton();
      calc.pressBackspaceButton();
      expect(calc.getDisplayString()).toBe("123");
    });
  });

  describe("Further tests from The Odin Project page", () => {
    test("You should round answers with long decimals so that they don’t overflow the screen.", () => {
      const calc = new Calculator();
      calc.pressNumberButton(2);
      calc.pressOperatorButton("/");
      calc.pressNumberButton(3);
      calc.pressEqualsButton();
      const expected =
        "0." + "6".repeat(MAX_DECIMAL_PLACES_IN_DISPLAY - 1) + "7";
      expect(calc.getDisplayString()).toBe(expected);
    });

    test("Pressing “clear” should wipe out any existing data. Make sure the user is really starting fresh after pressing “clear”.", () => {
      const calc = new Calculator();
      calc.pressNumberButton(2);
      calc.pressOperatorButton("/");
      calc.pressNumberButton(3);
      calc.pressOperatorButton("+");
      calc.pressNumberButton(9);
      calc.pressClearButton();
      expect(calc.getDisplayString()).toBe("0");
      expect(calc.getAccumulator()).toBe(null);
      expect(calc.getCurrentInputNumber()).toBe(null);
      expect(calc.getNextOperator()).toBe(null);
      expect(calc.getDecimalButtonPressed()).toBe(false);
      expect(calc.getNextDecimalPlace()).toBe(null);
    });

    test("Add a “backspace” button, so the user can undo if they click the wrong number.", () => {
      const calc = new Calculator();
      calc.pressNumberButton(2);
      calc.pressNumberButton(3);
      calc.pressBackspaceButton();
      expect(calc.getDisplayString()).toBe("2");
    });

    test("Press '=' button before pressing any other buttons should not do anything", () => {
      const calc = new Calculator();
      calc.pressEqualsButton();
      expect(calc.getDisplayString()).toBe("0");
    });

    describe("Add keyboard support!", () => {
      test("Sending none-string input should fail with an error", () => {
        const calc = new Calculator();
        expect(() => {
          calc.pressKey(5);
        }).toThrow("Expected string, got number");
      });

      test("Sending 'a' should fail with an error", () => {
        const calc = new Calculator();
        expect(() => {
          calc.pressKey("a");
        }).toThrow("Invalid key: a");
      });

      test("Sending '1' should display 1", () => {
        const calc = new Calculator();
        calc.pressKey("1");
        expect(calc.getDisplayString()).toBe("1");
      });

      test("Sending '1', '2', '+', '3', '=' should display 15", () => {
        const calc = new Calculator();
        calc.pressKey("1");
        calc.pressKey("2");
        calc.pressKey("+");
        calc.pressKey("3");
        calc.pressKey("=");
        expect(calc.getDisplayString()).toBe("15");
      });

      // Test for the backspace key

      test("Sending '1', '2', backspace should display 1", () => {
        const calc = new Calculator();
        calc.pressKey("1");
        calc.pressKey("2");
        calc.pressKey("Backspace");
        expect(calc.getDisplayString()).toBe("1");
      });

      // Test for the Enter key, it should behave the same as the equals key

      test("Sending '1', '2', '+', '3', Enter should display 15", () => {
        const calc = new Calculator();
        calc.pressKey("1");
        calc.pressKey("2");
        calc.pressKey("+");
        calc.pressKey("3");
        calc.pressKey("Enter");
        expect(calc.getDisplayString()).toBe("15");
      });
    });
  });

  describe("pressKeys method", () => {
    it("Causes 123 to display when '123' is passed to it.", () => {
      const calc = new Calculator();
      calc.pressKeys("123");
      expect(calc.getDisplayString()).toBe("123");
    });

    it("Throws an error when a non-string is passed to it", () => {
      const calc = new Calculator();
      expect(() => {
        calc.pressKeys(123);
      }).toThrow("Expected string, got number");
    });
  });

  describe("handleUiButtonPressed method", () => {
    it("Causes the number 1 to be displayed when the '1' button is pressed", () => {
      const calc = new Calculator();
      calc.handleUiButtonPressed("1");
      expect(calc.getDisplayString()).toBe("1");
    });

    it("Causes the * operator to be used when the '*' button is pressed", () => {
      const calc = new Calculator();
      calc.handleUiButtonPressed("*");
      expect(calc.getNextOperator()).toBe("*");
    });

    it("Causes the calculator to be cleared when the Clear button is pressed", () => {
      const calc = new Calculator();
      calc.pressKeys("1234.56+789=");
      calc.handleUiButtonPressed("Clear");
      expect(calc.getDisplayString()).toBe("0");
      expect(calc.getAccumulator()).toBe(null);
      expect(calc.getCurrentInputNumber()).toBe(null);
      expect(calc.getNextOperator()).toBe(null);
      expect(calc.getDecimalButtonPressed()).toBe(false);
      expect(calc.getNextDecimalPlace()).toBe(null);
    });

    it("handles backspace", () => {
      const calc = new Calculator();
      calc.pressKeys("12345");
      calc.handleUiButtonPressed("Backspace");
      expect(calc.getDisplayString()).toBe("1234");
    });

    it("handles the decimal point button", () => {
      const calc = new Calculator();
      calc.handleUiButtonPressed("5");
      calc.handleUiButtonPressed(".");
      calc.handleUiButtonPressed("3");
      expect(calc.getDisplayString()).toBe("5.3");
    });
  });

  it("Presses = on the calculator when the '=' UI button is pressed", () => {
    const calc = new Calculator();
    calc.pressKeys("123+456=");
    calc.handleUiButtonPressed("=");
    expect(calc.getDisplayString()).toBe("579");
  });

  it("Raises an exception when an unknown button is pressed", () => {
    const calc = new Calculator();
    expect(() => {
      calc.handleUiButtonPressed("Unknown");
    }).toThrow("Invalid button: Unknown");
  });
});
