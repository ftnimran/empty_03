/**
 * @param {number[]} nums
 * @return {number[]}
 */
var leftRightDifference = function (nums) {
  const n = nums.length;
  const ans = new Array(n);

  let right = 0;

  for (const num of nums) {
    right += num;
  }

  let left = 0;

  for (let i = 0; i < n; i++) {
    right -= nums[i];
    ans[i] = Math.abs(left - right);
    left += nums[i];
  }

  return ans;
};
