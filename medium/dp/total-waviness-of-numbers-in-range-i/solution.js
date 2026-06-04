/**
 * @param {number} num1
 * @param {number} num2
 * @return {number}
 */
var totalWaviness = function (num1, num2) {
  let ans = 0;

  for (let num = num1; num <= num2; num++) {
    const s = String(num);

    for (let i = 1; i < s.length - 1; i++) {
      const a = s.charCodeAt(i - 1);
      const b = s.charCodeAt(i);
      const c = s.charCodeAt(i + 1);

      if ((b > a && b > c) || (b < a && b < c)) {
        ans++;
      }
    }
  }

  return ans;
};
