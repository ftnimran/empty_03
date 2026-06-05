/**
 * @param {number} num1
 * @param {number} num2
 * @return {number}
 */
var totalWaviness = function (num1, num2) {
  const calc = (n) => {
    if (n <= 0) return 0n;

    const s = String(n);
    const memo = new Map();

    const dfs = (pos, tight, started, a, b) => {
      if (pos === s.length) {
        return [1n, 0n];
      }

      const key = !tight ? `${pos}|${started}|${a}|${b}` : null;

      if (key && memo.has(key)) {
        return memo.get(key);
      }

      const limit = tight ? Number(s[pos]) : 9;

      let ways = 0n;
      let sum = 0n;

      for (let d = 0; d <= limit; d++) {
        const ntight = tight && d === limit;

        if (!started && d === 0) {
          const [cnt, wav] = dfs(pos + 1, ntight, false, 10, 10);

          ways += cnt;
          sum += wav;
          continue;
        }

        if (!started) {
          const [cnt, wav] = dfs(pos + 1, ntight, true, 10, d);

          ways += cnt;
          sum += wav;
          continue;
        }

        let add = 0n;

        if (a !== 10) {
          if ((b > a && b > d) || (b < a && b < d)) {
            add = 1n;
          }
        }

        const [cnt, wav] = dfs(pos + 1, ntight, true, b, d);

        ways += cnt;
        sum += wav + cnt * add;
      }

      const res = [ways, sum];

      if (key) memo.set(key, res);

      return res;
    };

    return dfs(0, true, false, 10, 10)[1];
  };

  return Number(calc(num2) - calc(num1 - 1));
};
