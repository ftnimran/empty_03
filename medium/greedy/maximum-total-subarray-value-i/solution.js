/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var maxTotalValue = function (nums, k) {
  let mn = nums[0];
  let mx = nums[0];

  for (let i = 1; i < nums.length; i++) {
    if (nums[i] < mn) mn = nums[i];
    if (nums[i] > mx) mx = nums[i];
  }

  return (mx - mn) * k;
};
