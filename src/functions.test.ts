import { add } from './functions';

describe('add function', () => {
  test('adding 1 and 2 returns 3', () => {
    expect(add(1, 2)).toBe(3);
  })

  test('adding 5 and 6 returns 11', () => {
    expect(add(5, 6)).toBe(11);
  })
});
