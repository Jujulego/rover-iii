import { Queue } from './Queue';

// Tests
test('Queue pop order', () => {
  // Init
  const queue = new Queue<number>();

  expect(queue.next).toBeUndefined();
  expect(queue.size).toBe(0);
  expect(queue.isEmpty).toBe(true);

  // Add items
  queue.add(1);
  queue.add(2);

  expect(queue.next).toBe(1);
  expect(queue.size).toBe(2);
  expect(queue.isEmpty).toBe(false);

  // Pop items
  expect(queue.pop()).toBe(1);
  expect(queue.pop()).toBe(2);

  expect(queue.next).toBeUndefined();
  expect(queue.size).toBe(0);
  expect(queue.size).toBe(0);
  expect(queue.isEmpty).toBe(true);
});
