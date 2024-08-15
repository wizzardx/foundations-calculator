import { runDocTests } from "./custom-doctest.js";
import {
  add,
  subtract,
  multiply,
  divide,
  operatorFunc,
  getOpFunc,
} from "./functions.js";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("functions.ts Doctests", () => {
  it("should pass all JSDoc examples", async () => {
    const absolutePath = path.resolve(__dirname, "functions.ts");
    await expect(runDocTests(absolutePath)).resolves.not.toThrow();
  });
});

describe("add function", () => {
  test("adding 1 and 2 returns 3", () => {
    expect(add(1, 2)).toBe(3);
  });

  test("adding 5 and 6 returns 11", () => {
    expect(add(5, 6)).toBe(11);
  });
});

describe("subtract function", () => {
  test("subtracting 5 from 7 returns 2", () => {
    expect(subtract(7, 5)).toBe(2);
  });

  test("subtracting 7 from 2 returns -5", () => {
    expect(subtract(2, 7)).toBe(-5);
  });
});

describe("multiply function", () => {
  test("multiplying 2 by 3 returns 6", () => {
    expect(multiply(2, 3)).toBe(6);
  });

  test("multiplying -5 by 10 returns -50", () => {
    expect(multiply(-5, 10)).toBe(-50);
  });
});

describe("divide function", () => {
  test("dividing 10 by 2 returns 5", () => {
    expect(divide(10, 2)).toBe(5);
  });

  test("dividing 6 by 3 returns 2", () => {
    expect(divide(6, 3)).toBe(2);
  });
});

describe("Expected global variables for calculator", () => {
  test("first number global exists", () => {
    expect(firstNumber).toBe(undefined);
  });

  test("operator global exists", () => {
    expect(operator).toBe(undefined);
  });

  test("second number global exists", () => {
    expect(secondNumber).toBe(undefined);
  });
});

describe("operate function", () => {
  test("dividing 10 by 2 returns 5", () => {
    expect(operatorFunc("divide", 10, 2)).toBe(5);
  });

  test("adding 7 to 5 returns 12", () => {
    expect(operatorFunc("plus", 7, 5)).toBe(12);
  });
});

describe("getOpFunc", () => {
  test("Passing in 'plus' gets the 'add' function", () => {
    expect(getOpFunc("plus")).toBe(add);
  });

  test("Passing in 'minus' gets the 'subtract' function", () => {
    expect(getOpFunc("minus")).toBe(subtract);
  });

  test("Passing in 'multiply' gets the 'multiply' function", () => {
    expect(getOpFunc("multiply")).toBe(multiply);
  });

  test("Passing in 'divide' gets the 'divide' function", () => {
    expect(getOpFunc("divide")).toBe(divide);
  });
});
