/**
 * @param {number[]} nums
 * @param {number} pivot
 * @return {number[]}
 */
/**
 * @param {number[]} nums
 * @param {number} pivot
 * @return {number[]}
 */
var pivotArray = function (nums, pivot) {
  const ans = [];
  let pivotCount = 0;

  for (const num of nums) {
    if (num < pivot) {
      ans.push(num);
    } else if (num === pivot) {
      pivotCount++;
    }
  }

  while (pivotCount--) {
    ans.push(pivot);
  }

  for (const num of nums) {
    if (num > pivot) {
      ans.push(num);
    }
  }

  return ans;
};
