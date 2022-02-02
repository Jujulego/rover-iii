import { PriorityQueue } from './PriorityQueue';

// Tests
test('PriorityQueue pop order', () => {
  // Init
  const queue = new PriorityQueue<number>();

  expect(queue.next).toBeUndefined();
  expect(queue.size).toBe(0);
  expect(queue.isEmpty).toBe(true);

  // Add items
  queue.add(2, 2);
  queue.add(1, 1);
  queue.add(3, 3);

  expect(queue.next).toBe(1);
  expect(queue.size).toBe(3);
  expect(queue.isEmpty).toBe(false);

  // Pop items
  expect(queue.pop()).toBe(1);
  expect(queue.pop()).toBe(2);
  expect(queue.pop()).toBe(3);

  expect(queue.next).toBeUndefined();
  expect(queue.size).toBe(0);
  expect(queue.size).toBe(0);
  expect(queue.isEmpty).toBe(true);
});

test('PriorityQueue.updateCosts', () => {
  // Init
  const queue = new PriorityQueue<number>();

  expect(queue.next).toBeUndefined();
  expect(queue.size).toBe(0);
  expect(queue.isEmpty).toBe(true);

  // Add items
  queue.add(2, 2);
  queue.add(1, 1);
  queue.add(3, 3);

  expect(queue.next).toBe(1);
  expect(queue.size).toBe(3);
  expect(queue.isEmpty).toBe(false);

  // Resort
  queue.updateCosts((n) => 4 - n);

  expect(queue.next).toBe(3);
  expect(queue.size).toBe(3);
  expect(queue.isEmpty).toBe(false);

  // Pop items
  expect(queue.pop()).toBe(3);
  expect(queue.pop()).toBe(2);
  expect(queue.pop()).toBe(1);

  expect(queue.next).toBeUndefined();
  expect(queue.size).toBe(0);
  expect(queue.size).toBe(0);
  expect(queue.isEmpty).toBe(true);
});
