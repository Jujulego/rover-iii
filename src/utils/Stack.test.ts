import { Stack } from './Stack';

// Tests
test('Stack pop order', () => {
  // Init
  const stack = new Stack<number>();

  expect(stack.next).toBeUndefined();
  expect(stack.size).toBe(0);
  expect(stack.isEmpty).toBe(true);

  // Add items
  stack.add(1);
  stack.add(2);

  expect(stack.next).toBe(2);
  expect(stack.size).toBe(2);
  expect(stack.isEmpty).toBe(false);

  // Pop items
  expect(stack.pop()).toBe(2);
  expect(stack.pop()).toBe(1);

  expect(stack.next).toBeUndefined();
  expect(stack.size).toBe(0);
  expect(stack.size).toBe(0);
  expect(stack.isEmpty).toBe(true);
});
