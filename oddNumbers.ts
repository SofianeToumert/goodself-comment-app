/**
 * Validates that a value is a valid integer for odd/even checking.
 * Filters out:
 * - NaN values
 * - Infinity and -Infinity
 * - Floating point numbers (decimals)
 */
const isValidInteger = (n: number): boolean =>
  Number.isFinite(n) && Number.isInteger(n);

/**
 * Checks if a number is odd.
 * Works correctly with negative integers (e.g., -3 is odd, -4 is even).
 * Returns false for invalid numbers (NaN, Infinity, floats).
 */
const isOdd = (n: number): boolean => {
  if (!isValidInteger(n)) return false;
  return n % 2 !== 0;
};

/**
 * Removes odd numbers from an array.
 *
 * Edge cases handled:
 * - Empty arrays: returns empty array
 * - Negative integers: correctly identifies odd/even (-3 removed, -4 kept)
 * - Non-integers (floats): filtered out (not valid for odd/even check)
 * - NaN values: filtered out
 * - Infinity/-Infinity: filtered out
 *
 * Note: Does not mutate the original array.
 */
const removeOddNumbers = (arr: number[]): number[] => {
  return arr.filter((element: number) => isValidInteger(element) && !isOdd(element));
};

/**
 * Sums all odd numbers in an array.
 *
 * Edge cases handled:
 * - Empty arrays: returns 0
 * - No valid odd numbers: returns 0
 * - Negative odd integers: included in sum (e.g., -3 is added)
 * - Non-integers (floats): excluded from sum
 * - NaN values: excluded from sum
 * - Infinity/-Infinity: excluded from sum
 *
 * Note: Does not mutate the original array.
 */
const sumOddNumbers = (arr: number[]): number => {
  return arr.filter(isOdd).reduce((acc: number, curr: number) => acc + curr, 0);
};

// Test cases for verification
console.log("Normal case [1-10]:");
console.log("  removeOddNumbers:", removeOddNumbers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])); // [2, 4, 6, 8, 10]
console.log("  sumOddNumbers:", sumOddNumbers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])); // 25

console.log("\nEmpty array []:");
console.log("  removeOddNumbers:", removeOddNumbers([])); // []
console.log("  sumOddNumbers:", sumOddNumbers([])); // 0

console.log("\nNegative numbers [-3, -2, -1, 0, 1, 2, 3]:");
console.log("  removeOddNumbers:", removeOddNumbers([-3, -2, -1, 0, 1, 2, 3])); // [-2, 0, 2]
console.log("  sumOddNumbers:", sumOddNumbers([-3, -2, -1, 0, 1, 2, 3])); // 0

console.log("\nFloats mixed [1.5, 2.7, 3, 4]:");
console.log("  removeOddNumbers:", removeOddNumbers([1.5, 2.7, 3, 4])); // [4]
console.log("  sumOddNumbers:", sumOddNumbers([1.5, 2.7, 3, 4])); // 3

console.log("\nInvalid numbers [NaN, Infinity, 1, 2, 3]:");
console.log("  removeOddNumbers:", removeOddNumbers([NaN, Infinity, 1, 2, 3])); // [2]
console.log("  sumOddNumbers:", sumOddNumbers([NaN, Infinity, 1, 2, 3])); // 4
