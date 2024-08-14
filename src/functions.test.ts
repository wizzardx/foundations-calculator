import { add, subtract } from "./functions";

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
